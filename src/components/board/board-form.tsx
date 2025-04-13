"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react" // useCallback 추가
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Paperclip, Loader2, X } from "lucide-react" // X 아이콘 추가
import dynamic from "next/dynamic"
import type { TiptapEditorRef } from "@/components/board/tiptap-editor" // 경로 확인 필요
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// --- Supabase 설정 ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
    console.error("Supabase URL or Anon Key is missing in environment variables.")
    // 실제 환경에서는 에러를 던지거나 사용자에게 알림 표시 등 추가 처리 필요
}

const EDITOR_IMAGE_BUCKET_NAME = 'post-images'; // 에디터 이미지 버킷 이름 확인
const ATTACHMENT_BUCKET_NAME = 'baro-studio';   // 첨부파일 버킷 이름 확인

// --- Tiptap 에디터 동적 로딩 ---
const TiptapEditor = dynamic(() => import("@/components/board/tiptap-editor"), { // 경로 확인 필요
    ssr: false,
    loading: () => (
        <div className="w-full min-h-[250px] border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
            에디터 로딩 중...
        </div>
    ),
})

// --- 백엔드로 보낼 첨부파일 데이터 타입 정의 (File 모델 기준) ---
interface AttachmentInputData {
    filename: string;
    storagePath: string; // Supabase 경로 (고유해야 함)
    url?: string;        // Supabase Public URL
    mimeType?: string;
    sizeBytes?: number;
}

// --- 컴포넌트 ---
export default function PostForm() {
    // --- 상태 관리 ---
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("<p></p>") // 초기 빈 내용
    const [files, setFiles] = useState<File[]>([])     // 일반 첨부파일 목록
    const [editorImages, setEditorImages] = useState<Map<string, File>>(new Map()) // 에디터 내 이미지 <dataUrl, File> 맵
    const [isSubmitting, setIsSubmitting] = useState(false) // 제출 중 상태
    const [isNotice, setIsNotice] = useState(false);       // 공지사항 여부 상태
    const editorRef = useRef<TiptapEditorRef>(null)     // Tiptap 에디터 참조

    // --- 콜백 핸들러 ---

    // TiptapEditor에서 이미지 파일 추가 시 호출 (data:URL과 File 객체 받음)
    const handleImageFileAdd = useCallback((file: File, dataUrl: string) => {
        setEditorImages(prevMap => new Map(prevMap).set(dataUrl, file))
    }, []); // 의존성 배열 비어있음 (컴포넌트 마운트 시 한 번만 생성)

    // 일반 첨부파일 선택 시 호출 (기존 배열에 새 파일 추가)
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("handleFileChange triggered!");
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            console.log("New files selected:", newFiles);
            // 함수형 업데이트: 기존 파일 배열(prevFiles)에 새 파일 배열(newFiles)을 합침
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
            // 파일 선택 후 input 값 초기화 (선택적: 같은 파일 다시 선택 가능하게 함)
            e.target.value = '';
        } else {
            console.log("No files selected or event target issue.");
        }
    }, []); // 의존성 배열 비어있음

    // 첨부파일 목록에서 파일 제거 시 호출
    const handleRemoveFile = useCallback((indexToRemove: number) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    }, []); // 의존성 배열 비어있음

    // --- 폼 제출 처리 ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!supabase) {
            alert("Supabase 클라이언트가 초기화되지 않았습니다.")
            return;
        }
        if (isSubmitting) return // 중복 제출 방지

        setIsSubmitting(true)
        console.log("Form submission started...")

        const rawHtmlContent = editorRef.current?.getContent() ?? ""
        let finalHtmlContent = rawHtmlContent // 최종적으로 DB에 저장될 HTML

        // --- 기본 유효성 검사 ---
        const isContentEmpty = !rawHtmlContent || rawHtmlContent.replace(/<[^>]*>/g, "").trim() === "" || rawHtmlContent === "<p></p>"
        if (!title.trim()) {
            alert("제목을 입력해주세요.")
            setIsSubmitting(false)
            return
        }
        if (isContentEmpty) {
            alert("내용을 입력해주세요.")
            setIsSubmitting(false)
            return
        }
        // --- 끝: 기본 유효성 검사 ---

        const imageUploadPromises: Promise<{ dataUrl: string, publicUrl: string }>[] = []
        const attachmentUploadPromises: Promise<AttachmentInputData>[] = []

        // --- 1. 에디터 이미지 업로드 준비 ---
        const editorImagesToUpload = new Map<string, File>()
        editorImages.forEach((file, dataUrl) => {
            if (rawHtmlContent.includes(dataUrl)) {
                editorImagesToUpload.set(dataUrl, file);
                debugger;
                // *** 파일 이름 URL 인코딩 적용 ***
                const sanitizedBaseName = file.name.replace(/\s+/g, '_'); // 공백 처리
                const encodedName = encodeURIComponent(sanitizedBaseName); // URL 인코딩
                const imageFilePath = `public/posts/${Date.now()}-${encodedName}`; // 인코딩된 이름 사용

                console.log("[DEBUG] Uploading editor image with path:", imageFilePath);

                // 업로드 Promise 생성
                imageUploadPromises.push(
                    new Promise(async (resolve, reject) => {
                        try {
                            console.log(`Uploading editor image ${file.name} to: ${imageFilePath}`);
                            const { data: uploadData, error: uploadError } = await supabase!.storage
                                .from(EDITOR_IMAGE_BUCKET_NAME)
                                .upload(imageFilePath, file, { upsert: false });

                            if (uploadError) return reject(new Error(`Editor Img Upload Error: ${uploadError.message}`));

                            const { data: urlData } = supabase!.storage
                                .from(EDITOR_IMAGE_BUCKET_NAME)
                                .getPublicUrl(imageFilePath);

                            if (!urlData?.publicUrl) return reject(new Error('Failed to get public URL for editor image'));
                            console.log(`Editor image ${file.name} Public URL: ${urlData.publicUrl}`);
                            resolve({ dataUrl, publicUrl: urlData.publicUrl });
                        } catch (err) {
                            console.error(`Unexpected error uploading editor image ${file.name}:`, err);
                            reject(err instanceof Error ? err : new Error(String(err)));
                        }
                    })
                );
            } else {
                console.log(`Skipping unused editor image: ${file.name}`);
            }
        });
        console.log(`Identified ${editorImagesToUpload.size} editor images to upload.`);

        // --- 2. 첨부파일 업로드 준비 ---
        files.forEach((file) => {
            const attachmentStoragePath = `public/attachments/${Date.now()}-${file.name.replace(/\s+/g, '_')}`; // 고유 경로 생성
            // 업로드 Promise 생성
            attachmentUploadPromises.push(
                new Promise(async (resolve, reject) => {
                    try {
                        console.log(`Uploading attachment ${file.name} to: ${attachmentStoragePath}`);
                        const { data: uploadData, error: uploadError } = await supabase!.storage
                            .from(ATTACHMENT_BUCKET_NAME)
                            .upload(attachmentStoragePath, file, { upsert: false });

                        if (uploadError) return reject(new Error(`Attachment Upload Error: ${uploadError.message}`));

                        const { data: urlData } = supabase!.storage
                            .from(ATTACHMENT_BUCKET_NAME)
                            .getPublicUrl(attachmentStoragePath);

                        if (!urlData?.publicUrl) return reject(new Error('Failed to get public URL for attachment'));
                        console.log(`Attachment ${file.name} Public URL: ${urlData.publicUrl}`);
                        // 성공 시 DB 저장용 데이터 반환
                        resolve({
                            filename: file.name,
                            storagePath: attachmentStoragePath,
                            url: urlData.publicUrl,
                            mimeType: file.type,
                            sizeBytes: file.size
                        });
                    } catch (error) {
                        console.error(`Unexpected error uploading attachment ${file.name}:`, error);
                        reject(error instanceof Error ? error : new Error(String(error)));
                    }
                })
            );
        });
        console.log(`Identified ${files.length} general attachments to upload.`);


        try {
            // --- 3. 모든 업로드 병렬 실행 및 결과 기다리기 ---
            const allUploadPromises = [...imageUploadPromises, ...attachmentUploadPromises];
            let editorUploadResults: { dataUrl: string, publicUrl: string }[] = [];
            let attachmentUploadResults: AttachmentInputData[] = [];

            if (allUploadPromises.length > 0) {
                console.log(`Waiting for ${allUploadPromises.length} total uploads...`);
                const settledResults = await Promise.allSettled(allUploadPromises);
                console.log("All uploads settled.");

                const failedUploads: PromiseRejectedResult[] = [];
                settledResults.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        if (index < imageUploadPromises.length) {
                            editorUploadResults.push(result.value as { dataUrl: string, publicUrl: string });
                        } else {
                            attachmentUploadResults.push(result.value as AttachmentInputData);
                        }
                    } else {
                        failedUploads.push(result);
                    }
                });

                // 실패 처리
                if (failedUploads.length > 0) {
                    console.error(`${failedUploads.length} uploads failed:`, failedUploads.map(f => f.reason));
                    // 실제 서비스에서는 실패 원인을 좀 더 상세히 사용자에게 알리는 것이 좋음
                    throw new Error(`${failedUploads.length}개의 파일 업로드에 실패했습니다.`);
                }
                console.log("All necessary uploads completed successfully.");
            } else {
                console.log("No files needed uploading.");
            }

            // --- 4. HTML 내용에서 에디터 이미지 data:URL 교체 ---
            if (editorUploadResults.length > 0) {
                console.log("Replacing editor image data:URLs with Supabase public URLs...");
                editorUploadResults.forEach(({ dataUrl, publicUrl }) => {
                    finalHtmlContent = finalHtmlContent.replaceAll(`src="${dataUrl}"`, `src="${publicUrl}"`);
                });
                console.log("Replacement complete for editor images.");
            }

            // --- 5. 최종 데이터 준비 ---
            const postData = {
                title: title.trim(),
                content: finalHtmlContent,
                isNotice: isNotice,
                // 중요: managerId는 실제 로그인된 사용자 정보로 대체해야 합니다!
                managerId: "clwbm7y5400001axn6s81t7vb", // <<< 예시 ID, 실제 값으로 변경 필요
                attachments: attachmentUploadResults, // 업로드된 첨부파일 정보 배열
            };

            console.log("Final post data prepared:", postData);

            // --- 6. 백엔드 API로 데이터 전송 ---
            console.log("Sending data to backend API (/api/board)..."); // API 경로 확인
            // API 경로가 `/api/board`가 맞는지 확인하세요. 이전 예제에서는 `/api/posts`였습니다.
            const response = await fetch('/api/board', { // <<< API 경로 확인!
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                // 서버 에러 응답 처리
                let errorMsg = `API Error: ${response.status}`;
                try { const errorData = await response.json(); errorMsg = errorData.message || errorMsg; } catch (e) {/* ignore */ }
                throw new Error(errorMsg);
            }

            const result = await response.json();
            console.log('Post and files saved successfully:', result);
            alert("게시글과 첨부파일이 성공적으로 등록되었습니다!");

            // --- 성공 후 폼 초기화 또는 페이지 이동 등 ---
            // 예시:
            // setTitle("");
            // setContent("<p></p>");
            // setFiles([]);
            // setEditorImages(new Map());
            // setIsNotice(false);
            // editorRef.current?.setContent("<p></p>");
            // router.push('/board'); // Next.js router 사용 시

        } catch (error) {
            console.error("Error during submission process:", error);
            alert(`등록 중 오류 발생: ${error instanceof Error ? error.message : String(error)}`);
            // 오류 발생 시, 이미 업로드된 파일들에 대한 롤백(삭제) 로직 고려 가능 (복잡도 증가)
        } finally {
            setIsSubmitting(false); // 제출 상태 해제
            console.log("Form submission ended.");
        }
    };

    // --- JSX 렌더링 ---
    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-md my-8"> {/* 상하 마진 추가 */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">새 글 작성</h1>
                </div>

                {/* 제목 입력 */}
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-semibold text-gray-700">제목</Label>
                    <Input
                        id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md text-sm h-11 px-4" required
                    />
                </div>

                {/* 공지사항 체크박스 */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox" id="isNotice" checked={isNotice} onChange={(e) => setIsNotice(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <Label htmlFor="isNotice" className="text-sm font-medium text-gray-700 cursor-pointer"> {/* 커서 포인터 추가 */}
                        공지사항으로 등록
                    </Label>
                </div>

                {/* 내용 에디터 */}
                <div className="space-y-2">
                    <Label htmlFor="content-editor" className="text-base font-semibold text-gray-700">내용</Label>
                    <TiptapEditor
                        initialValue={content} onChange={setContent} ref={editorRef}
                        placeholder="내용을 입력하세요..." minHeight="300px"
                        onImageFileAdd={handleImageFileAdd}
                    />
                </div>

                {/* 첨부파일 섹션 */}
                <div className="space-y-3">
                    <Label htmlFor="file-upload" className="text-base font-semibold text-gray-700">첨부파일 (선택)</Label>
                    <div className="flex items-center space-x-4">
                        {/* 파일 찾기 버튼 */}
                        <Button
                            type="button" variant="outline" size="sm"
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md transition duration-150 ease-in-out"
                            onClick={() => document.getElementById("file-upload-input")?.click()}
                            disabled={isSubmitting} // 제출 중 비활성화
                        >
                            <Paperclip className="w-4 h-4" /> 파일 찾기
                        </Button>
                        {/* 숨겨진 파일 입력 */}
                        <Input id="file-upload-input" type="file" multiple onChange={handleFileChange} className="hidden" />
                        {/* 파일 정보 표시 */}
                        <span className="text-sm text-gray-600">
                            {files.length > 0 ? `${files.length}개 파일 (${(files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB)` : "파일당 최대 10MB"}
                        </span>
                    </div>
                    {/* 선택된 파일 목록 */}
                    {files.length > 0 && (
                        <ul className="mt-3 list-none space-y-2 pl-1">
                            {files.map((file, index) => (
                                <li key={index} className="flex items-center justify-between text-sm text-gray-700 bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition duration-150 ease-in-out">
                                    <span className="flex items-center truncate mr-2" title={file.name}>
                                        <Paperclip className="w-4 h-4 inline-block mr-2 text-gray-500 flex-shrink-0" /> {/* 아이콘 축소 방지 */}
                                        <span className="truncate">{file.name}</span> {/* 파일 이름만 truncate */}
                                        <span className="text-gray-500 text-xs ml-2 whitespace-nowrap">({(file.size / 1024 / 1024).toFixed(2)} MB)</span> {/* 줄바꿈 방지 */}
                                    </span>
                                    {/* 파일 삭제 버튼 */}
                                    <Button
                                        type="button" variant="ghost" size="icon"
                                        className="h-6 w-6 text-red-500 hover:bg-red-100 rounded-full flex-shrink-0" // 원형 버튼, 축소 방지
                                        onClick={() => handleRemoveFile(index)}
                                        disabled={isSubmitting} // 제출 중 비활성화
                                        title="파일 삭제"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 액션 버튼 */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-10">
                    <Button
                        variant="outline" type="button"
                        className="px-6 py-2.5 text-sm font-semibold border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
                        onClick={() => window.history.back()} // 간단한 뒤로가기
                        disabled={isSubmitting} // 제출 중 비활성화
                    >
                        취소
                    </Button>
                    <Button
                        type="submit"
                        className="px-8 py-2.5 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md transition duration-150 ease-in-out flex items-center gap-2 disabled:opacity-50"
                        disabled={isSubmitting} // 제출 중 비활성화
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? "등록 중..." : "등록"}
                    </Button>
                </div>
            </form>
        </div>
    )
}