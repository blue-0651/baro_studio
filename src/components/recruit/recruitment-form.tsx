"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Paperclip, Loader2, X, FileText, Trash2 } from "lucide-react"
import dynamic from "next/dynamic"
import type { TiptapEditorRef } from "@/components/board/tiptap-editor"
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from "next/navigation"
import { formatBytes } from "@/lib/utils";

import DatePicker, { registerLocale } from "react-datepicker";
import { enUS } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('en-US', enUS);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
    console.error("Supabase URL or Anon Key is missing. File/Image uploads might fail.")
}

const EDITOR_IMAGE_BUCKET_NAME = 'post-images';
const ATTACHMENT_BUCKET_NAME = 'baro-studio';

const TiptapEditor = dynamic(() => import("@/components/board/tiptap-editor"), {
    ssr: false,
    loading: () => (
        <div className="w-full min-h-[200px] border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
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

interface JobData {
    id?: number;
    title: string;
    experience: string;
    location: string;
    employmentType: string;
    deadline?: Date | string | null;
    isAlwaysRecruiting: boolean;
    content: string | null;
    files: ExistingFileData[];
}


interface JobFormProps {
    mode: 'create' | 'update';
    initialData?: JobData;
    jobId?: number;
}

const parseInitialDate = (date: Date | string | null | undefined): Date | null => {
    if (!date) return null;
    try {
        if (date instanceof Date && !isNaN(date.getTime())) {
            return date;
        }
        if (typeof date === 'string') {
            const d = new Date(date);
            return isNaN(d.getTime()) ? null : d;
        }
        return null;
    } catch (e) {
        return null;
    }
};


export default function JobForm({ mode, initialData, jobId }: JobFormProps) {
    const [title, setTitle] = useState(initialData?.title ?? "");
    const [experience, setExperience] = useState(initialData?.experience ?? "");
    const [location, setLocation] = useState(initialData?.location ?? "");
    const [employmentType, setEmploymentType] = useState(initialData?.employmentType ?? "");
    const [deadline, setDeadline] = useState<Date | null>(parseInitialDate(initialData?.deadline));
    const [isAlwaysRecruiting, setIsAlwaysRecruiting] = useState(initialData?.isAlwaysRecruiting ?? false);
    const [content, setContent] = useState(initialData?.content ?? "<p></p>");
    const [editorImages, setEditorImages] = useState<Map<string, File>>(new Map());
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [existingFiles, setExistingFiles] = useState<ExistingFileData[]>(initialData?.files ?? []);
    const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const editorRef = useRef<TiptapEditorRef>(null);
    const router = useRouter();




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
        }
    }, [mode]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            alert("Supabase client is not initialized. File/Image uploads cannot proceed.");
            return;
        }
        if (isSubmitting) return;

        setIsSubmitting(true);
        console.log(`Job form submission started (${mode} mode)...`);

        const rawHtmlContent = editorRef.current?.getContent() ?? content;
        let finalHtmlContent = rawHtmlContent;

        if (!title.trim()) { alert("Please enter a job title."); setIsSubmitting(false); return; }
        if (!experience.trim()) { alert("Please enter the experience requirements."); setIsSubmitting(false); return; }
        if (!location.trim()) { alert("Please enter the location."); setIsSubmitting(false); return; }
        if (!employmentType.trim()) { alert("Please enter the employment type."); setIsSubmitting(false); return; }
        if (!isAlwaysRecruiting && !deadline) { alert("Please specify a deadline or check 'Always Recruiting'."); setIsSubmitting(false); return; }

        const imageUploadPromises: Promise<{ dataUrl: string, publicUrl: string }>[] = [];
        const attachmentUploadPromises: Promise<AttachmentInputData>[] = [];

        const generateUniqueFilename = (originalName: string): string => {
            const fileExt = originalName.split('.').pop() || 'file';
            return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
        };

        editorImages.forEach((file, dataUrl) => {
            if (rawHtmlContent.includes(dataUrl)) {
                const imageFilePath = `public/job-images/${generateUniqueFilename(file.name)}`;
                imageUploadPromises.push(
                    new Promise(async (resolve, reject) => {
                        try {
                            const { error: uploadError } = await supabase!.storage
                                .from(EDITOR_IMAGE_BUCKET_NAME)
                                .upload(imageFilePath, file, { upsert: false });
                            if (uploadError) throw new Error(`Editor Image Upload Error: ${uploadError.message}`);

                            const { data: urlData } = supabase!.storage.from(EDITOR_IMAGE_BUCKET_NAME).getPublicUrl(imageFilePath);
                            if (!urlData?.publicUrl) throw new Error('Failed to get public URL for editor image');
                            resolve({ dataUrl, publicUrl: urlData.publicUrl });
                        } catch (err) {
                            console.error(`Error uploading editor image ${file.name}:`, err);
                            reject(err instanceof Error ? err : new Error(String(err)));
                        }
                    })
                );
            }
        });

        newFiles.forEach((file) => {
            const attachmentStoragePath = `public/job-attachments/${generateUniqueFilename(file.name)}`;
            attachmentUploadPromises.push(
                new Promise(async (resolve, reject) => {
                    try {
                        const { error: uploadError } = await supabase!.storage
                            .from(ATTACHMENT_BUCKET_NAME)
                            .upload(attachmentStoragePath, file, { upsert: false });
                        if (uploadError) throw new Error(`Attachment Upload Error: ${uploadError.message}`);

                        const { data: urlData } = supabase!.storage.from(ATTACHMENT_BUCKET_NAME).getPublicUrl(attachmentStoragePath);
                        if (!urlData?.publicUrl) throw new Error('Failed to get public URL for attachment');
                        resolve({
                            filename: file.name,
                            storagePath: attachmentStoragePath,
                            url: urlData.publicUrl,
                            mimeType: file.type,
                            sizeBytes: file.size
                        });
                    } catch (error) {
                        console.error(`Error uploading attachment ${file.name}:`, error);
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
                    const errorMessages = failedUploads.map(f => f.reason instanceof Error ? f.reason.message : String(f.reason)).join('\n - ');
                    console.error(`${failedUploads.length} uploads failed:`, failedUploads.map(f => f.reason));
                    throw new Error(`${failedUploads.length} file uploads failed:\n - ${errorMessages}`);
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
            }
            editorUploadResults.forEach(({ dataUrl, publicUrl }) => {
                finalHtmlContent = finalHtmlContent.replaceAll(dataUrl, publicUrl);
            });

            const apiMethod = mode === 'create' ? 'POST' : 'PUT';
            const apiUrl = mode === 'create' ? '/api/recruite' : `/api/recruite/${jobId}`;

            const apiDeadline = isAlwaysRecruiting || !deadline ? null : deadline.toISOString();

            const jobDataPayload = {
                title: title.trim(),
                experience: experience.trim(),
                location: location.trim(),
                employmentType: employmentType.trim(),
                deadline: apiDeadline,
                isAlwaysRecruiting: isAlwaysRecruiting,
                content: finalHtmlContent,
                newAttachments: newAttachmentUploadResults,
                deletedFileIds: deletedFileIds,
            };

            console.log(`Sending ${apiMethod} request to ${apiUrl} with data:`, jobDataPayload);

            const response = await fetch(apiUrl, {
                method: apiMethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jobDataPayload),
            });

            if (!response.ok) {
                let errorMsg = `API Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorData.error || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }

            const result = await response.json();
            console.log("API response:", result);

            if (response.ok) {
                alert(mode === 'create' ? "Job posting created successfully!" : "Job posting updated successfully!");

                setTitle("");
                setExperience("");
                setLocation("");
                setEmploymentType("");
                setDeadline(null);
                setIsAlwaysRecruiting(false);
                setContent("<p></p>");
                setEditorImages(new Map());
                setNewFiles([]);
                setExistingFiles([]);
                setDeletedFileIds([]);
                editorRef.current?.setContent("<p></p>");

                router.push(mode === 'create' ? '/company/recruitment' : `/company/recruitment/${jobId}`);
                router.refresh();
            } else {
                throw new Error(result.message || result.error || `Failed to ${mode} job posting.`);
            }

        } catch (error) {
            alert(`Error during ${mode}: ${error instanceof Error ? error.message : String(error)}`);
            console.error("Submission error details:", error);
        } finally {
            setIsSubmitting(false);
            console.log("Job form submission ended.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-md my-8">
            <style>{`
                .react-datepicker-wrapper { display: block; width: 100%; }
                .react-datepicker__input-container input {
                  display: block; /* Ensure it takes full width */
                  width: 100%;
                  height: 2.75rem; /* h-11 */
                  padding-left: 1rem; /* px-4 */
                  padding-right: 1rem; /* px-4 */
                  border-radius: 0.375rem; /* rounded-md */
                  border: 1px solid #d1d5db; /* border-gray-300 */
                  font-size: 0.875rem; /* text-sm */
                  line-height: 1.25rem;
                  color: #1f2937; /* text-gray-900 */
                  background-color: #fff; /* bg-white */
                  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
                  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }
                .react-datepicker__input-container input::placeholder {
                    color: #9ca3af; /* placeholder:text-gray-400 */
                }
                .react-datepicker__input-container input:focus {
                  border-color: #4f46e5; /* focus:border-indigo-500 */
                  outline: 2px solid transparent;
                  outline-offset: 2px;
                  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #a5b4fc; /* focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 */
                }
                .react-datepicker__input-container input:disabled {
                  background-color: #f9fafb; /* disabled:bg-gray-50 */
                  opacity: 0.7; /* disabled:opacity-70 */
                  cursor: not-allowed;
                }
                  .react-datepicker-popper {
                  z-index: 50; /* 다른 요소들보다 높은 z-index 값 부여 (필요시 더 높게 조정) */
                }
                /* You might need more styles for the calendar popup itself if you want to customize it */
            `}</style>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
                        {mode === 'create' ? 'Create New Job Posting' : 'Edit Job Posting'}
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-base font-semibold text-gray-700">Job Title</Label>
                        <Input
                            id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="employmentType" className="text-base font-semibold text-gray-700">Employment Type</Label>
                        <Input
                            id="employmentType" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="experience" className="text-base font-semibold text-gray-700">Experience Level</Label>
                        <Input
                            id="experience" value={experience} onChange={(e) => setExperience(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-base font-semibold text-gray-700">Location</Label>
                        <Input
                            id="location" value={location} onChange={(e) => setLocation(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="deadline-picker" className="text-base font-semibold text-gray-700">Application Deadline</Label>
                        <DatePicker
                            id="deadline-picker"
                            selected={deadline}
                            onChange={(date: Date | null) => setDeadline(date)}
                            locale="en-US"
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select a date (YYYY-MM-DD)"
                            minDate={new Date()}
                            disabled={isAlwaysRecruiting || isSubmitting}
                            className="input-style-applied-by-css"
                            wrapperClassName="w-full"
                            showPopperArrow={false}
                            isClearable
                        />
                        {!isAlwaysRecruiting && !deadline && <p className="text-xs text-red-500 mt-1">Please select a deadline or check 'Always Recruiting'.</p>}
                    </div>
                </div>
                <div className="flex self-center space-x-2 pb-2.5">
                    <Checkbox
                        id="isAlwaysRecruiting"
                        checked={isAlwaysRecruiting}
                        onCheckedChange={(checked) => setIsAlwaysRecruiting(Boolean(checked))} // Handle boolean conversion
                        disabled={isSubmitting}
                    />
                    <Label htmlFor="isAlwaysRecruiting" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Always Recruiting (No Deadline)
                    </Label>
                </div>


                <div className="space-y-2">
                    <Label htmlFor="content-editor" className="text-base font-semibold text-gray-700">Job Details</Label>
                    <TiptapEditor
                        initialValue={content}
                        onChange={setContent}
                        ref={editorRef}
                        minHeight="250px"
                        onImageFileAdd={handleImageFileAdd}
                    />
                </div>

                <div className="space-y-4">
                    <Label className="text-base font-semibold text-gray-700">Attachments (Optional)</Label>

                    {mode === 'update' && existingFiles.length > 0 && (
                        <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <p className="text-sm font-medium text-gray-600 mb-2">Currently Attached Files:</p>
                            <ul className="list-none space-y-1.5">
                                {existingFiles.map((file) => (
                                    <li key={file.id} className="flex items-center justify-between text-sm text-gray-800 hover:bg-gray-100 p-1.5 rounded transition duration-150">
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center truncate mr-2 flex-grow min-w-0 group" title={`Download ${file.filename}`}>
                                            <FileText className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                                            <span className="truncate group-hover:underline">{file.filename}</span>
                                            <span className="text-gray-500 text-xs ml-2 whitespace-nowrap flex-shrink-0">({formatBytes(file.sizeBytes)})</span>
                                        </a>
                                        <Button
                                            type="button" variant="ghost" size="icon"
                                            className="h-6 w-6 text-red-500 hover:bg-red-100 rounded-full flex-shrink-0 ml-2"
                                            onClick={() => handleRemoveExistingFile(file)}
                                            disabled={isSubmitting}
                                            title={`Mark ${file.filename} for removal`}
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
                            className="flex items-center gap-2"
                            onClick={() => document.getElementById("file-upload-input")?.click()}
                            disabled={isSubmitting}
                        >
                            <Paperclip className="w-4 h-4" /> Add File(s)
                        </Button>
                        <Input id="file-upload-input" type="file" multiple onChange={handleFileChange} className="hidden" />
                        <span className="text-sm text-gray-600">
                            {newFiles.length > 0
                                ? `${newFiles.length} new file${newFiles.length > 1 ? 's' : ''} ready (${formatBytes(newFiles.reduce((acc, file) => acc + file.size, 0))})`
                                : "You can attach relevant documents."}
                        </span>
                    </div>

                    {newFiles.length > 0 && (
                        <div className="mt-3 pl-1">
                            <p className="text-sm font-medium text-gray-600 mb-2">New files to be uploaded:</p>
                            <ul className="list-none space-y-1.5">
                                {newFiles.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between text-sm text-gray-800 bg-blue-50 p-1.5 rounded hover:bg-blue-100 transition duration-150">
                                        <span className="flex items-center truncate mr-2 flex-grow min-w-0" title={file.name}>
                                            <Paperclip className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                                            <span className="truncate">{file.name}</span>
                                            <span className="text-gray-500 text-xs ml-2 whitespace-nowrap flex-shrink-0">({formatBytes(file.size)})</span>
                                        </span>
                                        <Button
                                            type="button" variant="ghost" size="icon"
                                            className="h-6 w-6 text-red-500 hover:bg-red-100 rounded-full flex-shrink-0 ml-2"
                                            onClick={() => handleRemoveNewFile(index)}
                                            disabled={isSubmitting}
                                            title={`Cancel adding ${file.name}`}
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
                        variant="outline" type="button"
                        className="px-6 py-2"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="px-8 py-2 flex items-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? (mode === 'create' ? "Creating..." : "Updating...") : (mode === 'create' ? "Create Posting" : "Update Posting")}
                    </Button>
                </div>
            </form>
        </div>
    );
}