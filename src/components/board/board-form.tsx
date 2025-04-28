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
import { useSession } from "next-auth/react";
import { useLang } from '@/context/LangContext';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
    console.error("Supabase URL or Anon Key is missing in environment variables.")
}

const EDITOR_IMAGE_BUCKET_NAME = 'post-images';
const ATTACHMENT_BUCKET_NAME = 'baro-studio';

const translations = {
    en: {
        createTitle: 'Create New Post',
        editTitle: 'Edit Post',
        titleLabel: 'Title',
        titlePlaceholder: 'Enter the title',
        noticeLabel: 'Register as Notice',
        contentLabel: 'Content',
        contentPlaceholder: 'Enter the content...',
        attachmentsLabel: 'Attachments',
        existingAttachmentsLabel: 'Existing Attachments:',
        deleteFileTitle: 'Delete File',
        addFilesButton: 'Add File(s)',
        newFilesAdded: (count: number, size: string) => `${count} new file(s) added (${size})`,
        attachDocsHint: 'You can attach relevant documents.',
        cancelAddFileTitle: 'Cancel adding file',
        creatingButton: 'Creating...',
        updatingButton: 'Updating...',
        createButton: 'Create',
        updateButton: 'Update',
        cancelButton: 'Cancel',
        editorLoading: 'Editor loading...',
        alertDuplicateFile: "Files with the same name as existing or newly added files have been excluded.",
        alertSupabaseInitFail: "Supabase client is not initialized.",
        alertNoTitle: "Please enter a title.",
        alertNoContent: "Please enter the content.",
        alertUploadError: (count: number) => `${count} file upload${count > 1 ? 's' : ''} failed.`,
        alertCreateSuccess: "Post and attachments created successfully!",
        alertUpdateSuccess: "Post updated successfully!",
        alertSubmitError: (mode: string, error: string) => `Error during ${mode === 'create' ? 'creation' : 'update'}: ${error}`,
        confirmRemoveFile: (filename: string, mode: string) => `Are you sure you want to remove the file '${filename}'?\nThis action will be permanent once you click '${mode === 'create' ? 'Create' : 'Update'}'.`,
        alertMissingPostId: "Post ID is missing for update operation."
    },
    kr: {
        createTitle: '새 게시물 작성',
        editTitle: '게시물 수정',
        titleLabel: '제목',
        titlePlaceholder: '제목을 입력하세요',
        noticeLabel: '공지사항으로 등록',
        contentLabel: '내용',
        contentPlaceholder: '내용을 입력하세요...',
        attachmentsLabel: '첨부파일',
        existingAttachmentsLabel: '기존 첨부파일:',
        deleteFileTitle: '파일 삭제',
        addFilesButton: '파일 추가',
        newFilesAdded: (count: number, size: string) => `${count}개의 새 파일 추가됨 (${size})`,
        attachDocsHint: '관련 문서를 첨부할 수 있습니다.',
        cancelAddFileTitle: '파일 추가 취소',
        creatingButton: '생성 중...',
        updatingButton: '수정 중...',
        createButton: '생성',
        updateButton: '수정',
        cancelButton: '취소',
        editorLoading: '편집기 로딩 중...',
        alertDuplicateFile: "기존 파일 또는 새로 추가된 파일과 이름이 같은 파일은 제외되었습니다.",
        alertSupabaseInitFail: "Supabase 클라이언트가 초기화되지 않았습니다.",
        alertNoTitle: "제목을 입력해주세요.",
        alertNoContent: "내용을 입력해주세요.",
        alertUploadError: (count: number) => `${count}개의 파일 업로드 실패.`,
        alertCreateSuccess: "게시물과 첨부파일이 성공적으로 생성되었습니다!",
        alertUpdateSuccess: "게시물이 성공적으로 수정되었습니다!",
        alertSubmitError: (mode: string, error: string) => `${mode === 'create' ? '생성' : '수정'} 중 오류 발생: ${error}`,
        confirmRemoveFile: (filename: string, mode: string) => `파일 '${filename}'을(를) 삭제하시겠습니까?\n'${mode === 'create' ? '생성' : '수정'}' 버튼을 클릭하면 이 작업은 영구적으로 적용됩니다.`,
        alertMissingPostId: "수정 작업을 위한 게시물 ID가 없습니다."
    }
};


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
    id?: number;
    boardId: number | string;
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
    const { lang } = useLang();

    const t = (key: keyof typeof translations.en, ...args: any[]) => {
        const translationSet = translations[lang as keyof typeof translations] ?? translations.en;
        let translation = translationSet[key];
        if (translation === undefined) {
            console.warn(`Translation missing for key: ${key} in language: ${lang}`);
            translation = key as any;
        }
        if (typeof translation === 'function') {
            try {
                return (translation as (...args: any[]) => string)(...args);
            } catch (e) {
                console.error(`Error formatting translation for key "${String(key)}" with args:`, args, e);
                return String(key);
            }
        }
        return String(translation);
    };

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
    const { data: session } = useSession();


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
                alert(t('alertDuplicateFile'));
            }
            setNewFiles(prevFiles => [...prevFiles, ...uniqueNewFiles]);
            e.target.value = '';
        }
    }, [newFiles, existingFiles, t]);

    const handleRemoveNewFile = useCallback((indexToRemove: number) => {
        setNewFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    }, []);

    const handleRemoveExistingFile = useCallback((fileToRemove: ExistingFileData) => {
        if (window.confirm(t('confirmRemoveFile', fileToRemove.filename, mode))) {
            setExistingFiles(prevFiles => prevFiles.filter(file => file.id !== fileToRemove.id));
            setDeletedFileIds(prevIds => [...prevIds, fileToRemove.id]);
            console.log("Marked for deletion (will be processed on submit):", fileToRemove.id, fileToRemove.filename);
        }
    }, [mode, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            alert(t('alertSupabaseInitFail'));
            return;
        }
        if (isSubmitting) return;

        setIsSubmitting(true);
        console.log(`Form submission started (${mode} mode)...`);

        const rawHtmlContent = editorRef.current?.getContent() ?? "";
        let finalHtmlContent = rawHtmlContent;

        const isContentEmpty = !rawHtmlContent || rawHtmlContent.replace(/<[^>]*>/g, "").trim() === "" || rawHtmlContent === "<p></p>";
        if (!title.trim()) {
            alert(t('alertNoTitle'));
            setIsSubmitting(false);
            return;
        }
        if (isContentEmpty) {
            alert(t('alertNoContent'));
            setIsSubmitting(false);
            return;
        }

        const imageUploadPromises: Promise<{ dataUrl: string, publicUrl: string }>[] = [];
        const attachmentUploadPromises: Promise<AttachmentInputData>[] = [];
        const generateUniqueFilename = (originalName: string) => {
            const fileExt = originalName.split('.').pop() || 'file';
            return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
        };

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
            const allUploadPromises = [...imageUploadPromises, ...attachmentUploadPromises];
            let editorUploadResults: { dataUrl: string, publicUrl: string }[] = [];
            let newAttachmentUploadResults: AttachmentInputData[] = [];

            if (allUploadPromises.length > 0) {
                console.log(`Waiting for ${allUploadPromises.length} total uploads...`);
                const settledResults = await Promise.allSettled(allUploadPromises);

                const failedUploads = settledResults.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
                if (failedUploads.length > 0) {
                    console.error(`${failedUploads.length} uploads failed:`, failedUploads.map(f => f.reason));
                    throw new Error(t('alertUploadError', failedUploads.length));
                }

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

            editorUploadResults.forEach(({ dataUrl, publicUrl }) => {
                finalHtmlContent = finalHtmlContent.replaceAll(dataUrl, publicUrl);
            });

            const userId = (session?.user as any)?.id || "baroAdmin";

            const postDataPayload: any = {
                title: title.trim(),
                content: finalHtmlContent,
                isNotice: isNotice,
                managerId: userId,
                newAttachments: newAttachmentUploadResults,
                deletedFileIds: deletedFileIds,
            };

            if (mode === 'create' && initialData?.boardId) {
                postDataPayload.boardId = initialData.boardId;
            }

            const currentBoardIdForUpdate = mode === 'update' ? boardId : undefined;
            if (mode === 'update' && !currentBoardIdForUpdate) {
                throw new Error(t('alertMissingPostId'));
            }

            const apiMethod = mode === 'create' ? 'POST' : 'PUT';
            const apiUrl = mode === 'create' ? '/api/board' : `/api/board/${currentBoardIdForUpdate}`;

            console.log(`Sending ${apiMethod} request to ${apiUrl} with data:`, JSON.stringify(postDataPayload, null, 2));

            const response = await fetch(apiUrl, {
                method: apiMethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postDataPayload),
            });

            if (!response.ok) {
                let errorMsg = `API Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (e) { /* ignore */ }
                throw new Error(errorMsg);
            }

            const result = await response.json();
            console.log("API response:", result);

            if (result.success) {
                alert(mode === 'create' ? t('alertCreateSuccess') : t('alertUpdateSuccess'));
                setTitle("");
                setContent("<p></p>");
                setNewFiles([]);
                setExistingFiles([]);
                setDeletedFileIds([]);
                setEditorImages(new Map());
                setIsNotice(false);
                editorRef.current?.setContent("<p></p>");

                const redirectPath = mode === 'create'
                    ? `/company/board`
                    : `/company/board/${currentBoardIdForUpdate}`;
                router.push(redirectPath);
                router.refresh();
            } else {
                throw new Error(result.message || `Failed to ${mode === 'create' ? 'create' : 'update'} post.`);
            }

        } catch (error) {
            alert(t('alertSubmitError', mode, error instanceof Error ? error.message : String(error)));
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
                        {mode === 'create' ? t('createTitle') : t('editTitle')}
                    </h1>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-semibold text-gray-700">{t('titleLabel')}</Label>
                    <Input
                        id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('titlePlaceholder')}
                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md text-sm h-11 px-4" required
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox" id="isNotice" checked={isNotice} onChange={(e) => setIsNotice(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        disabled={isSubmitting}
                    />
                    <Label htmlFor="isNotice" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        {t('noticeLabel')}
                    </Label>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content-editor" className="text-base font-semibold text-gray-700">{t('contentLabel')}</Label>
                    <TiptapEditor
                        initialValue={content}
                        onChange={setContent}
                        ref={editorRef}
                        placeholder={t('contentPlaceholder')}
                        minHeight="300px"
                        onImageFileAdd={handleImageFileAdd}
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700">{t('attachmentsLabel')}</Label>

                    {mode === 'update' && existingFiles.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <p className="text-sm font-medium text-gray-600 mb-2">{t('existingAttachmentsLabel')}</p>
                            <ul className="list-none space-y-2">
                                {existingFiles.map((file) => (
                                    <li key={file.id} className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-100 p-1.5 rounded-md transition duration-150 ease-in-out">
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center truncate mr-2 flex-grow min-w-0 group" title={file.filename}>
                                            <FileText className="w-4 h-4 inline-block mr-2 text-gray-500 flex-shrink-0" />
                                            <span className="truncate group-hover:underline">{file.filename}</span>
                                            <span className="text-gray-500 text-xs ml-2 whitespace-nowrap flex-shrink-0">({formatBytes(file.sizeBytes)})</span>
                                        </a>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-red-500 hover:bg-red-100 rounded-full flex-shrink-0 ml-2"
                                            onClick={() => handleRemoveExistingFile(file)}
                                            disabled={isSubmitting}
                                            title={t('deleteFileTitle')}
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
                            <Paperclip className="w-4 h-4" /> {t('addFilesButton')}
                        </Button>
                        <Input id="file-upload-input" type="file" multiple onChange={handleFileChange} className="hidden" disabled={isSubmitting} />
                        <span className="text-sm text-gray-600">
                            {newFiles.length > 0 ? t('newFilesAdded', newFiles.length, formatBytes(newFiles.reduce((acc, file) => acc + file.size, 0))) : t('attachDocsHint')}
                        </span>
                    </div>

                    {newFiles.length > 0 && (
                        <div className="mt-3 pl-1">
                            <ul className="list-none space-y-2">
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
                                            title={t('cancelAddFileTitle')}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-10">
                    <Button
                        type="submit"
                        className="px-8 py-2.5 text-sm font-semibold bg-[#F68E1E] text-white rounded-md hover:bg-[#E57D0D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A6D6E7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting
                            ? (mode === 'create' ? t('creatingButton') : t('updatingButton'))
                            : (mode === 'create' ? t('createButton') : t('updateButton'))}
                    </Button>
                    <Button
                        variant="outline" type="button"
                        className="px-6 py-2.5 text-sm font-semibold border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        {t('cancelButton')}
                    </Button>

                </div>
            </form>
        </div>
    );
}