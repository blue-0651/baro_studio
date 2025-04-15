"use client"

import { useRouter, useParams } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, FileText, Download, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button";
import { format } from "date-fns"
import { getQueryDetail } from "@/app/api/query/api.js";
import DOMPurify from 'dompurify';
import { useState, useMemo } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { formatBytes } from "@/lib/utils";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
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
/** supabase 환경변수 세팅 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.error("Supabase URL or Anon Key is missing in BoardDetailPage environment variables.");
}
/** storage bucket 중 첨부파일관련 버킷  */
const ATTACHMENT_BUCKET_NAME = 'baro-studio';


export default function BoardDetailPage() {
    const { data: session } = useSession();
    const router = useRouter()
    const params = useParams()
    const boardId = params?.id as string
    //다운로드 state
    const [downloadingFileId, setDownloadingFileId] = useState<number | null>(null);
    //로딩 state
    const [isDeleting, setIsDeleting] = useState(false);
    const queryClient = useQueryClient();

    // 게시글 상세 조회 useQuery
    const {
        data: post,
        isLoading,
        error,
    } = useQuery<Post, Error>({
        queryKey: ["post", boardId],
        queryFn: () => getQueryDetail(`/api/board/${boardId}`),
        enabled: !!boardId && !isNaN(parseInt(boardId, 10)),
    })

    //보안을위해서 xss 공격 방어
    const sanitizedHtml = useMemo(() => {
        if (typeof window !== 'undefined' && post?.content) {
            return DOMPurify.sanitize(post.content);
        }
        return post?.content || "No content";
    }, [post?.content]);

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%" }}>
                loading...
            </div>
        )
    }
    if (error) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%", color: "red" }}>
                error: {error.message}
            </div>
        )
    }
    if (!post) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%" }}>
                No posts found.

            </div>
        )
    }

    debugger;
    // 파일 다운로드
    const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>, file: FileData) => {
        e.preventDefault();

        if (!supabase) {
            alert("Unable to initialize the download service.");
            return;
        }
        // 이미 해당 파일 다운로드 중이면 무시
        if (downloadingFileId === file.id) return;

        setDownloadingFileId(file.id);

        try {
            const { data, error } = await supabase.storage
                .from(ATTACHMENT_BUCKET_NAME)
                .download(file.storagePath);

            if (error) {
                throw new Error(`파일 다운로드 중 오류 발생: ${error.message}`);
            }

            if (data) {
                // Blob 데이터를 사용하여 다운로드 링크 생성 및 클릭
                const url = window.URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file.filename);
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error("No data downloaded.");
            }

        } catch (err) {
            alert(err instanceof Error ? err.message : "An unknown error occurred while downloading the file.");
            console.error("File download failed:", err);
        } finally {
            setDownloadingFileId(null);
        }
    };

    //게시글 삭제
    const handleDeletePost = async () => {
        // 데이터 없거나 이미 삭제 중이면 무시
        if (!post || isDeleting) return;

        if (window.confirm(`'${post.title}' Are you sure you want to delete this post?\nAll attached files will be deleted as well. This action cannot be undone.`)) {
            setIsDeleting(true);
            try {
                const response = await fetch(`/api/board/${boardId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    let errorMsg = `Deletion failed: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.message || errorMsg;
                    } catch (e) { }
                    throw new Error(errorMsg);
                }

                const result = await response.json();

                if (result.success) {
                    alert("The post has been successfully deleted.");
                    await queryClient.invalidateQueries({ queryKey: ['posts'] });
                    // 목록 페이지로 이동
                    router.push("/company/board");
                    router.refresh();
                } else {
                    throw new Error(result.message || "Failed to delete post.");
                }

            } catch (err) {
                alert(`Error occurred while deleting: ${err instanceof Error ? err.message : String(err)}`);
            } finally {
                setIsDeleting(false);
            }
        }
    };



    const formattedDate = post.createdAt ? format(new Date(post.createdAt), "yyyy-MM-dd HH:mm") : "";
    const authorName = (post.manager?.id ? 'admin' : 'anonymous');

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
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeletePost}
                            disabled={isDeleting}
                            className="flex items-center gap-1"
                        >
                            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isDeleting ? 'deleting...' : 'Delete'}
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
                        attachment
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {post.files.map((file) => (
                            <li key={file.id}
                                style={{ display: "flex", alignItems: "center", justifyContent: 'space-between', marginBottom: "8px", padding: "8px 0" }}>

                                <a
                                    href={file.url}
                                    onClick={(e) => handleDownload(e, file)}
                                    style={{ display: 'flex', alignItems: 'center', color: "#0066cc", textDecoration: "none", fontSize: "14px", marginRight: '10px', cursor: 'pointer' }}
                                    title={`"${file.filename}" download`}
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
                <button onClick={() => router.push("/company/board")} style={{ backgroundColor: "#222", color: "white", border: "none", borderRadius: "4px", padding: "8px 16px", fontSize: "14px", cursor: "pointer" }}>
                    View List
                </button>
            </div>
        </div>
    );
}