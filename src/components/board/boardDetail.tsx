"use client"

import { useRouter, useParams } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, FileText, Download, Trash2, Loader2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button";
import { format } from "date-fns"
import { getQueryDetail } from "@/app/api/query/api.js";
import DOMPurify from 'dompurify';
import { useState, useMemo } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { formatBytes } from "@/lib/utils";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useLang } from '@/context/LangContext';

const translations = {
    en: {
        loading: "Loading...",
        errorPrefix: "Error",
        noPostsFound: "No posts found.",
        authorAdmin: "Admin",
        authorAnonymous: "Anonymous",
        editButton: "Edit",
        deleteButton: "Delete",
        deletingButton: "Deleting...",
        attachmentTitle: "Attachments",
        downloadFileTitle: (filename: string) => `Download "${filename}"`,
        alertDownloadInitFail: "Unable to initialize the download service.",
        alertDownloadError: (message: string) => `Error downloading file: ${message}`,
        alertDownloadUnknownError: "An unknown error occurred while downloading the file.",
        confirmDeletePost: (title: string) => `'${title}' Are you sure you want to delete this post?\nAll attached files will be deleted as well. This action cannot be undone.`,
        alertDeleteFailed: (message: string) => `Deletion failed: ${message}`,
        alertDeleteSuccess: "The post has been successfully deleted.",
        alertDeleteError: (message: string) => `Error occurred while deleting: ${message}`,
        viewListButton: "View List",
    },
    kr: {
        loading: "로딩 중...",
        errorPrefix: "오류",
        noPostsFound: "게시물을 찾을 수 없습니다.",
        authorAdmin: "관리자",
        authorAnonymous: "익명",
        editButton: "수정",
        deleteButton: "삭제",
        deletingButton: "삭제 중...",
        attachmentTitle: "첨부파일",
        downloadFileTitle: (filename: string) => `"${filename}" 다운로드`,
        alertDownloadInitFail: "다운로드 서비스를 초기화할 수 없습니다.",
        alertDownloadError: (message: string) => `파일 다운로드 중 오류 발생: ${message}`,
        alertDownloadUnknownError: "파일을 다운로드하는 중 알 수 없는 오류가 발생했습니다.",
        confirmDeletePost: (title: string) => `'${title}' 게시물을 삭제하시겠습니까?\n첨부된 모든 파일도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`,
        alertDeleteFailed: (message: string) => `삭제 실패: ${message}`,
        alertDeleteSuccess: "게시물이 성공적으로 삭제되었습니다.",
        alertDeleteError: (message: string) => `삭제 중 오류 발생: ${message}`,
        viewListButton: "목록 보기",
    }
};

interface FileData {
    id: number;
    filename: string;
    url: string;
    storagePath: string;
    sizeBytes: number;
    mimeType?: string;
    uploadedAt?: string | Date;
}

interface Post {
    boardId: number;
    title: string;
    createdAt: string | Date;
    isNotice: boolean;
    content: string | null;
    managerId?: string;
    manager: {
        id: string;
    };
    files: FileData[];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.error("Supabase URL or Anon Key is missing in BoardDetailPage environment variables.");
}
const ATTACHMENT_BUCKET_NAME = 'baro-studio';


export default function BoardDetailPage() {
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

    const { data: session } = useSession();
    const router = useRouter()
    const params = useParams()
    const boardId = params?.id as string
    const [downloadingFileId, setDownloadingFileId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const queryClient = useQueryClient();

    const {
        data: post,
        isLoading,
        error,
    } = useQuery<Post, Error>({
        queryKey: ["post", boardId],
        queryFn: () => getQueryDetail(`/api/board/${boardId}`),
        enabled: !!boardId && !isNaN(parseInt(boardId, 10)),
    })

    const sanitizedHtml = useMemo(() => {
        if (typeof window !== 'undefined' && post?.content) {
            return DOMPurify.sanitize(post.content);
        }
        return post?.content || "";
    }, [post?.content]);

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%" }}>
                {t('loading')}
            </div>
        )
    }
    if (error) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%", color: "red" }}>
                {t('errorPrefix')}: {error.message}
            </div>
        )
    }
    if (!post) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%" }}>
                {t('noPostsFound')}
            </div>
        )
    }

    const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>, file: FileData) => {
        e.preventDefault();

        if (!supabase) {
            alert(t('alertDownloadInitFail'));
            return;
        }
        if (downloadingFileId === file.id) return;

        setDownloadingFileId(file.id);

        try {
            const { data, error } = await supabase.storage
                .from(ATTACHMENT_BUCKET_NAME)
                .download(file.storagePath);

            if (error) {
                throw new Error(t('alertDownloadError', error.message));
            }

            if (data) {
                const url = window.URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file.filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error(t('alertDownloadUnknownError'));
            }

        } catch (err) {
            alert(err instanceof Error ? err.message : String(err));
            console.error("File download failed:", err);
        } finally {
            setDownloadingFileId(null);
        }
    };

    const handleDeletePost = async () => {
        if (!post || isDeleting) return;

        if (window.confirm(t('confirmDeletePost', post.title))) {
            setIsDeleting(true);
            try {
                const response = await fetch(`/api/board/${boardId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    let errorMsg = "";
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.message || "";
                    } catch (e) { }
                    throw new Error(t('alertDeleteFailed', errorMsg || String(response.status)));
                }

                const result = await response.json();

                if (result.success) {
                    alert(t('alertDeleteSuccess'));
                    await queryClient.invalidateQueries({ queryKey: ['posts'] });
                    router.push("/company/board");
                    router.refresh();
                } else {
                    throw new Error(t('alertDeleteError', result.message || "Unknown reason"));
                }

            } catch (err) {
                alert(err instanceof Error ? err.message : String(err));
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const formattedDate = post.createdAt ? format(new Date(post.createdAt), "yyyy-MM-dd HH:mm") : "";
    const authorName = (post.manager?.id ? t('authorAdmin') : t('authorAnonymous'));

    return (
        <div className="max-w-7xl mx-auto" style={{ margin: "0 auto", padding: "20px", fontFamily: "sans-serif", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>

            <h1 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "12px", lineHeight: "2.5" }}>
                {post.title}
            </h1>

            <div style={{ display: "flex", alignItems: 'center', fontSize: "14px", color: "#666", marginBottom: "24px" }}>
                <span style={{ marginRight: "12px" }}>{authorName}</span>
                <span>{formattedDate}</span>
                {session && (
                    <div style={{ marginLeft: "auto", display: 'flex', gap: '8px' }}>
                        <Button
                            variant="primaryBlue"
                            size="sm"
                            onClick={() => router.push(`/company/board/update/${post.boardId}`)}
                            disabled={isDeleting}
                            className="flex items-center gap-1.5"
                            style={{ width: "auto" }}
                        >
                            <Edit className="h-4 w-4" />
                            <span>{t('editButton')}</span>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeletePost}
                            disabled={isDeleting}
                            className="flex items-center gap-1.5"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>{t('deletingButton')}</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    <span>{t('deleteButton')}</span>
                                </>
                            )}
                        </Button>
                    </div>
                )
                }
            </div>

            <div
                className="prose h-auto max-w-none"
                style={{
                    borderTop: "1px solid #eee",
                    paddingTop: "24px",
                    marginBottom: "24px",
                    fontSize: "16px",
                    lineHeight: "1.6",
                    overflowWrap: 'break-word',
                    whiteSpace: "pre-wrap"
                }}
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            >
            </div>

            {post.files && post.files.length > 0 && (
                <div style={{ borderTop: "1px solid #eee", paddingTop: "16px", marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>
                        {t('attachmentTitle')}
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {post.files.map((file) => (
                            <li key={file.id}
                                style={{ display: "flex", alignItems: "center", justifyContent: 'space-between', marginBottom: "8px", padding: "8px 0" }}>

                                <a
                                    href={file.url}
                                    onClick={(e) => handleDownload(e, file)}
                                    style={{ display: 'flex', alignItems: 'center', color: "#0066cc", textDecoration: "none", fontSize: "14px", marginRight: '10px', cursor: 'pointer' }}
                                    title={t('downloadFileTitle', file.filename)}
                                >
                                    {downloadingFileId === file.id ? (
                                        <Download className="animate-pulse" style={{ width: "16px", height: "16px", marginRight: "8px", flexShrink: 0 }} />
                                    ) : (
                                        <FileText style={{ width: "16px", height: "16px", marginRight: "8px", flexShrink: 0 }} />
                                    )}
                                    <span style={{ wordBreak: 'break-all' }}>{file.filename}</span>
                                </a>

                                <span style={{ fontSize: "12px", color: "#888", whiteSpace: 'nowrap', marginLeft: 'auto', paddingLeft: '10px' }}>
                                    {formatBytes(file.sizeBytes)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                <button
                    onClick={() => router.push("/company/board")}
                    style={{
                        backgroundColor: "#F68E1E",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#E57D0D"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#F68E1E"}
                >
                    {t('viewListButton')}
                </button>

            </div>
        </div>
    );
}