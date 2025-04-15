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
                alert("Files with the same name as existing or newly added files have been excluded.");
            }
            setNewFiles(prevFiles => [...prevFiles, ...uniqueNewFiles]);
            e.target.value = '';
        }
    }, [newFiles, existingFiles]);

    const handleRemoveNewFile = useCallback((indexToRemove: number) => {
        setNewFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    }, []);

    const handleRemoveExistingFile = useCallback((fileToRemove: ExistingFileData) => {
        if (window.confirm(`Are you sure you want to remove the file '${fileToRemove.filename}'?\nThis action will be permanent once you click '${mode === 'create' ? 'Create' : 'Update'}'.`)) {
            setExistingFiles(prevFiles => prevFiles.filter(file => file.id !== fileToRemove.id));
            setDeletedFileIds(prevIds => [...prevIds, fileToRemove.id]);
            console.log("Marked for deletion (will be processed on submit):", fileToRemove.id, fileToRemove.filename);
        }
    }, [mode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            alert("Supabase client is not initialized.");
            return;
        }
        if (isSubmitting) return;

        setIsSubmitting(true);
        console.log(`Form submission started (${mode} mode)...`);

        const rawHtmlContent = editorRef.current?.getContent() ?? "";
        let finalHtmlContent = rawHtmlContent;

        const isContentEmpty = !rawHtmlContent || rawHtmlContent.replace(/<[^>]*>/g, "").trim() === "" || rawHtmlContent === "<p></p>";
        if (!title.trim()) {
            alert("Please enter a title.");
            setIsSubmitting(false);
            return;
        }
        if (isContentEmpty) {
            alert("Please enter the content.");
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
                    throw new Error(`${failedUploads.length} file upload(s) failed.`);
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

            const apiMethod = mode === 'create' ? 'POST' : 'PUT';
            const apiUrl = mode === 'create' ? '/api/board' : `/api/board/${boardId}`;

            const postData = {
                title: title.trim(),
                content: finalHtmlContent,
                isNotice: isNotice,
                managerId: "baroAdmin", // Assuming this is static or obtained elsewhere
                newAttachments: newAttachmentUploadResults,
                deletedFileIds: deletedFileIds,
            };

            console.log(`Sending ${apiMethod} request to ${apiUrl} with data:`, postData);

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

            if (result.success) {
                alert(mode === 'create' ? "Post and attachments created successfully!" : "Post updated successfully!");
                setTitle("");
                setContent("<p></p>");
                setNewFiles([]);
                setExistingFiles([]);
                setDeletedFileIds([]);
                setEditorImages(new Map());
                setIsNotice(false);
                editorRef.current?.setContent("<p></p>");
                router.push(mode === 'create' ? '/company/board' : `/company/board/${boardId}`);
                router.refresh();
            } else {
                throw new Error(result.message || `Failed to ${mode === 'create' ? 'create' : 'update'} post.`);
            }

        } catch (error) {
            alert(`Error during ${mode === 'create' ? 'creation' : 'update'}: ${error instanceof Error ? error.message : String(error)}`);
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
                        {mode === 'create' ? 'Create New Post' : 'Edit Post'}
                    </h1>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-semibold text-gray-700">Title</Label>
                    <Input
                        id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter the title"
                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md text-sm h-11 px-4" required
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox" id="isNotice" checked={isNotice} onChange={(e) => setIsNotice(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <Label htmlFor="isNotice" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Register as Notice
                    </Label>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content-editor" className="text-base font-semibold text-gray-700">Content</Label>
                    <TiptapEditor
                        initialValue={content}
                        onChange={setContent}
                        ref={editorRef}
                        placeholder="Enter the content..."
                        minHeight="300px"
                        onImageFileAdd={handleImageFileAdd}
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700">Attachments</Label>

                    {mode === 'update' && existingFiles.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <p className="text-sm font-medium text-gray-600 mb-2">Existing Attachments:</p>
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
                                            title="Delete File"
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
                            <Paperclip className="w-4 h-4" /> Add File(s)
                        </Button>
                        <Input id="file-upload-input" type="file" multiple onChange={handleFileChange} className="hidden" />
                        <span className="text-sm text-gray-600">
                            {newFiles.length > 0 ? `${newFiles.length} new file(s) added (${formatBytes(newFiles.reduce((acc, file) => acc + file.size, 0))})` : "You can attach relevant documents."}
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
                                        title="Cancel adding file"
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
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="px-8 py-2.5 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md transition duration-150 ease-in-out flex items-center gap-2 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? (mode === 'create' ? "Creating..." : "Updating...") : (mode === 'create' ? "Create" : "Update")}
                    </Button>
                </div>
            </form>
        </div>
    );
}