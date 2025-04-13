"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Paperclip, Loader2, X, FileText, Trash2 } from "lucide-react"
import dynamic from "next/dynamic"
import type { TiptapEditorRef } from "@/components/board/tiptap-editor"
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from "next/navigation"
import { formatBytes } from "@/lib/utils";

/** supabase 환경변수 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
    console.error("Supabase URL or Anon Key is missing in environment variables.")
}

// 스토리지 버킷 이름
const EDITOR_IMAGE_BUCKET_NAME = 'post-images';
const ATTACHMENT_BUCKET_NAME = 'baro-studio';

const TiptapEditor = dynamic(() => import("@/components/board/tiptap-editor"), {
    ssr: false,
    loading: () => (
        <div className="w-full min-h-[250px] border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
            Editor loading...
        </div>
    ),
})

interface AttachmentInputData {
    filename: string;
    storagePath: string;
    url?: string;
    mimeType?: string;
    sizeBytes?: number;
}

interface ExistingFileData {
    id: number;
    filename: string;
    url: string;
    storagePath: string;
    sizeBytes: number;
    mimeType?: string;
}

interface PostData {
    boardId: number;
    title: string;
    content: string | null;
    isNotice: boolean;
    files: ExistingFileData[];
}

interface PostFormProps {
    mode: 'create' | 'update';
    initialData?: PostData;
    boardId?: number | string;
}

export default function PostForm({ mode, initialData, boardId }: PostFormProps) {
    const [title, setTitle] = useState(initialData?.title ?? "");
    const [content, setContent] = useState(initialData?.content ?? "<p></p>");
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [existingFiles, setExistingFiles] = useState<ExistingFileData[]>(initialData?.files ?? []);
    const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);
    const [editorImages, setEditorImages] = useState<Map<string, File>>(new Map());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isNotice, setIsNotice] = useState(initialData?.isNotice ?? false);
    const editorRef = useRef<TiptapEditorRef>(null);
    const router = useRouter();

    useEffect(() => {
        if (mode === 'update' && initialData?.content && editorRef.current && !editorRef.current.getEditor()?.isFocused) {
        }
    }, [mode, initialData?.content]);

    const handleImageFileAdd = useCallback((file: File, dataUrl: string) => {
        setEditorImages(prevMap => new Map(prevMap).set(dataUrl, file));
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const addedFiles = Array.from(e.target.files);
            const uniqueNewFiles = addedFiles.filter(newFile =>
                !existingFiles.some(ef => ef.filename === newFile.name) &&
                !newFiles.some(nf => nf.name === newFile.name)
            );
            if (uniqueNewFiles.length !== addedFiles.length) {
                alert("이미 추가되었거나 기존에 존재하는 파일명과 동일한 파일은 제외되었습니다.");
            }
            setNewFiles(prevFiles => [...prevFiles, ...uniqueNewFiles]);
            e.target.value = '';
        }
    }, [newFiles, existingFiles]);

    const handleRemoveNewFile = useCallback((indexToRemove: number) => {
        setNewFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    }, []);

    const handleRemoveExistingFile = useCallback((fileToRemove: ExistingFileData) => {
        if (window.confirm(`'${fileToRemove.filename}' 파일을 정말 삭제하시겠습니까?\n이 작업은 '수정' 버튼을 누르면 영구적으로 적용됩니다.`)) {
            setExistingFiles(prevFiles => prevFiles.filter(file => file.id !== fileToRemove.id)); // UI에서 제거
            setDeletedFileIds(prevIds => [...prevIds, fileToRemove.id]); // 삭제 목록에 ID 추가
            console.log("Marked for deletion (will be processed on submit):", fileToRemove.id, fileToRemove.filename);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            alert("Supabase 클라이언트가 초기화되지 않았습니다.");
            return;
        }
        if (isSubmitting) return;

        setIsSubmitting(true);
        console.log(`Form submission started (${mode} mode)...`);

        const rawHtmlContent = editorRef.current?.getContent() ?? "";
        let finalHtmlContent = rawHtmlContent;

        const isContentEmpty = !rawHtmlContent || rawHtmlContent.replace(/<[^>]*>/g, "").trim() === "" || rawHtmlContent === "<p></p>";
        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            setIsSubmitting(false);
            return;
        }
        if (isContentEmpty) {
            alert("내용을 입력해주세요.");
            setIsSubmitting(false);
            return;
        }

        const imageUploadPromises: Promise<{ dataUrl: string, publicUrl: string }>[] = [];
        const attachmentUploadPromises: Promise<AttachmentInputData>[] = [];
        const generateUniqueFilename = (originalName: string) => {
            const fileExt = originalName.split('.').pop() || 'file';
            return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
        };
        // 수정된 파일 업로드 준비
        editorImages.forEach((file, dataUrl) => {
            if (rawHtmlContent.includes(dataUrl)) {
                const imageFilePath = `public/posts/${generateUniqueFilename(file.name)}`;
                imageUploadPromises.push(
                    new Promise(async (resolve, reject) => {
                        try {
                            const { data: uploadData, error: uploadError } = await supabase!.storage
                                .from(EDITOR_IMAGE_BUCKET_NAME)
                                .upload(imageFilePath, file, { upsert: false });
                            if (uploadError) throw new Error(`Editor Img Upload Error: ${uploadError.message}`);

                            const { data: urlData } = supabase!.storage
                                .from(EDITOR_IMAGE_BUCKET_NAME)
                                .getPublicUrl(imageFilePath);
                            if (!urlData?.publicUrl) throw new Error('Failed to get public URL for editor image');
                            resolve({ dataUrl, publicUrl: urlData.publicUrl });
                        } catch (err) {
                            reject(err instanceof Error ? err : new Error(String(err)));
                        }
                    })
                );
            }
        });

        //  새로 첨부된 파일 업로드 준비
        newFiles.forEach((file) => {
            const attachmentStoragePath = `public/attachments/${generateUniqueFilename(file.name)}`;
            attachmentUploadPromises.push(
                new Promise(async (resolve, reject) => {
                    try {
                        const { data: uploadData, error: uploadError } = await supabase!.storage
                            .from(ATTACHMENT_BUCKET_NAME)
                            .upload(attachmentStoragePath, file, { upsert: false });
                        if (uploadError) throw new Error(`Attachment Upload Error: ${uploadError.message}`);

                        const { data: urlData } = supabase!.storage
                            .from(ATTACHMENT_BUCKET_NAME)
                            .getPublicUrl(attachmentStoragePath);
                        if (!urlData?.publicUrl) throw new Error('Failed to get public URL for attachment');
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

        try {
            //  모든 새 파일 업로드 실행
            const allUploadPromises = [...imageUploadPromises, ...attachmentUploadPromises];
            let editorUploadResults: { dataUrl: string, publicUrl: string }[] = [];
            let newAttachmentUploadResults: AttachmentInputData[] = [];

            if (allUploadPromises.length > 0) {
                console.log(`Waiting for ${allUploadPromises.length} total uploads...`);
                const settledResults = await Promise.allSettled(allUploadPromises);

                const failedUploads = settledResults.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
                if (failedUploads.length > 0) {
                    console.error(`${failedUploads.length} uploads failed:`, failedUploads.map(f => f.reason));
                    throw new Error(`${failedUploads.length}개의 파일 업로드에 실패했습니다.`);
                }

                // 성공한 결과 분리
                settledResults.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        if (index < imageUploadPromises.length) {
                            editorUploadResults.push(result.value as { dataUrl: string, publicUrl: string });
                        } else {
                            newAttachmentUploadResults.push(result.value as AttachmentInputData);
                        }
                    }
                });
                console.log("All necessary uploads completed successfully.");
            } else {
                console.log("No new files needed uploading.");
            }

            // 에디터 내용의 data:URL을 실제 URL로 교체
            editorUploadResults.forEach(({ dataUrl, publicUrl }) => {
                finalHtmlContent = finalHtmlContent.replaceAll(dataUrl, publicUrl);
            });

            //  API 요청 데이터 준비
            const apiMethod = mode === 'create' ? 'POST' : 'PUT';
            debugger;
            const apiUrl = mode === 'create' ? '/api/board' : `/api/board/${boardId}`;

            const postData = {
                title: title.trim(),
                content: finalHtmlContent,
                isNotice: isNotice,
                managerId: "baroAdmin",
                newAttachments: newAttachmentUploadResults,
                deletedFileIds: deletedFileIds,
            };

            console.log(`Sending ${apiMethod} request to ${apiUrl} with data:`, postData);

            //  API 호출
            const response = await fetch(apiUrl, {
                method: apiMethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                let errorMsg = `API Error: ${response.status}`;
                try { const errorData = await response.json(); errorMsg = errorData.message || errorMsg; } catch (e) {/* ignore */ }
                throw new Error(errorMsg);
            }

            const result = await response.json();
            console.log("API response:", result);

            // 성공 처리 
            if (result.success) {
                alert(mode === 'create' ? "게시글과 첨부파일이 성공적으로 등록되었습니다!" : "게시글이 성공적으로 수정되었습니다!");
                // 상태 초기화
                setTitle("");
                setContent("<p></p>");
                setNewFiles([]);
                setExistingFiles([]);
                setDeletedFileIds([]);
                setEditorImages(new Map());
                setIsNotice(false);
                editorRef.current?.setContent("<p></p>");
                // 페이지 이동
                router.push(mode === 'create' ? '/company/board' : `/company/board/${boardId}`);
                router.refresh();
            } else {
                throw new Error(result.message || `${mode === 'create' ? '등록' : '수정'}에 실패했습니다.`);
            }

        } catch (error) {
            alert(`${mode === 'create' ? '등록' : '수정'} 중 오류 발생: ${error instanceof Error ? error.message : String(error)}`);
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
            console.log("Form submission ended.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-md my-8">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
                        {mode === 'create' ? '새 글 작성' : '글 수정'}
                    </h1>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-semibold text-gray-700">제목</Label>
                    <Input
                        id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md text-sm h-11 px-4" required
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox" id="isNotice" checked={isNotice} onChange={(e) => setIsNotice(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <Label htmlFor="isNotice" className="text-sm font-medium text-gray-700 cursor-pointer">
                        공지사항으로 등록
                    </Label>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content-editor" className="text-base font-semibold text-gray-700">내용</Label>
                    <TiptapEditor
                        initialValue={content}
                        onChange={setContent}
                        ref={editorRef}
                        placeholder="내용을 입력하세요..."
                        minHeight="300px"
                        onImageFileAdd={handleImageFileAdd}
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700">첨부파일</Label>

                    {mode === 'update' && existingFiles.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <p className="text-sm font-medium text-gray-600 mb-2">기존 첨부파일:</p>
                            <ul className="list-none space-y-2">
                                {existingFiles.map((file) => (
                                    <li key={file.id} className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-100 p-1.5 rounded-md transition duration-150 ease-in-out">
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center truncate mr-2 flex-grow min-w-0" title={file.filename}>
                                            <FileText className="w-4 h-4 inline-block mr-2 text-gray-500 flex-shrink-0" />
                                            <span className="truncate">{file.filename}</span>
                                            <span className="text-gray-500 text-xs ml-2 whitespace-nowrap flex-shrink-0">({formatBytes(file.sizeBytes)})</span>
                                        </a>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-red-500 hover:bg-red-100 rounded-full flex-shrink-0 ml-2"
                                            onClick={() => handleRemoveExistingFile(file)}
                                            disabled={isSubmitting}
                                            title="파일 삭제"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex items-center space-x-4">
                        <Button
                            type="button" variant="outline" size="sm"
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md transition duration-150 ease-in-out"
                            onClick={() => document.getElementById("file-upload-input")?.click()}
                            disabled={isSubmitting}
                        >
                            <Paperclip className="w-4 h-4" /> 파일 추가
                        </Button>
                        <Input id="file-upload-input" type="file" multiple onChange={handleFileChange} className="hidden" />
                        <span className="text-sm text-gray-600">
                            {newFiles.length > 0 ? `${newFiles.length}개 파일 새로 추가 (${formatBytes(newFiles.reduce((acc, file) => acc + file.size, 0))})` : "파일당 최대 10MB"}
                        </span>
                    </div>

                    {newFiles.length > 0 && (
                        <ul className="mt-3 list-none space-y-2 pl-1">
                            {newFiles.map((file, index) => (
                                <li key={index} className="flex items-center justify-between text-sm text-gray-700 bg-blue-50 p-1.5 rounded-md hover:bg-blue-100 transition duration-150 ease-in-out">
                                    <span className="flex items-center truncate mr-2 flex-grow min-w-0" title={file.name}>
                                        <Paperclip className="w-4 h-4 inline-block mr-2 text-blue-500 flex-shrink-0" />
                                        <span className="truncate">{file.name}</span>
                                        <span className="text-gray-500 text-xs ml-2 whitespace-nowrap flex-shrink-0">({formatBytes(file.size)})</span>
                                    </span>
                                    <Button
                                        type="button" variant="ghost" size="icon"
                                        className="h-6 w-6 text-red-500 hover:bg-red-100 rounded-full flex-shrink-0 ml-2"
                                        onClick={() => handleRemoveNewFile(index)}
                                        disabled={isSubmitting}
                                        title="추가한 파일 취소"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-10">
                    <Button
                        variant="outline" type="button"
                        className="px-6 py-2.5 text-sm font-semibold border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        취소
                    </Button>
                    <Button
                        type="submit"
                        className="px-8 py-2.5 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md transition duration-150 ease-in-out flex items-center gap-2 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? (mode === 'create' ? "등록 중..." : "수정 중...") : (mode === 'create' ? "등록" : "수정")}
                    </Button>
                </div>
            </form>
        </div>
    );
}