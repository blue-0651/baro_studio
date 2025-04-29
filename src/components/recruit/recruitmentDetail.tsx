"use client"

import { useRouter, useParams } from "next/navigation"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { ArrowLeft, FileText, Download, Trash2, Loader2, CalendarDays, MapPin, Briefcase, UserCheck, Edit } from "lucide-react"
import { Button } from "@/components/ui/button";
import { format } from "date-fns"
import { getQueryDetail } from "@/app/api/query/api.js";
import DOMPurify from 'dompurify';
import { useState, useMemo } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { formatBytes } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useLang } from '@/context/LangContext';

const translations = {
    en: {
        loading: "Loading...",
        errorTitle: "Error Loading Job Posting",
        errorGoBack: "Go Back to List",
        notFoundTitle: "Job Posting Not Found",
        postedOn: "Posted on:",
        notAvailable: "N/A",
        alwaysRecruiting: "Always Recruiting",
        notSpecified: "Not Specified",
        editButton: "Edit",
        deleteButton: "Delete",
        deletingButton: "Deleting...",
        employmentTypeLabel: "Employment Type",
        experienceLabel: "Experience",
        locationLabel: "Location",
        deadlineLabel: "Application Deadline",
        attachmentsTitle: "Attachments",
        downloadFileTitle: (filename: string) => `Download "${filename}"`,
        viewListButton: "View List",
        alertDownloadInitFail: "Unable to initialize the download service.",
        alertDownloadError: (message: string) => `File download error: ${message}`,
        alertDownloadNoData: "No data received for download.",
        alertDownloadUnknownError: "An unknown error occurred during download.",
        confirmDeleteJob: (title: string) => `Are you sure you want to delete the posting '${title}'?\nAssociated files in the database will also be removed. This action cannot be undone.`,
        alertDeleteSuccess: "The job posting has been successfully deleted.",
        alertDeleteError: (message: string) => `Error occurred while deleting: ${message}`,
        alertDeleteFailed: (message: string) => `Deletion failed: ${message}`,
        alertDeleteFailedGeneric: "Failed to delete job posting."
    },
    kr: {
        loading: "로딩 중...",
        errorTitle: "채용 공고 로딩 오류",
        errorGoBack: "목록으로 돌아가기",
        notFoundTitle: "채용 공고를 찾을 수 없습니다",
        postedOn: "게시일:",
        notAvailable: "정보 없음",
        alwaysRecruiting: "상시 채용",
        notSpecified: "미지정",
        editButton: "수정",
        deleteButton: "삭제",
        deletingButton: "삭제 중...",
        employmentTypeLabel: "고용 형태",
        experienceLabel: "경력",
        locationLabel: "근무지",
        deadlineLabel: "지원 마감일",
        attachmentsTitle: "첨부 파일",
        downloadFileTitle: (filename: string) => `"${filename}" 다운로드`,
        viewListButton: "목록 보기",
        alertDownloadInitFail: "다운로드 서비스를 초기화할 수 없습니다.",
        alertDownloadError: (message: string) => `파일 다운로드 오류: ${message}`,
        alertDownloadNoData: "다운로드할 데이터가 없습니다.",
        alertDownloadUnknownError: "다운로드 중 알 수 없는 오류가 발생했습니다.",
        confirmDeleteJob: (title: string) => `'${title}' 공고를 삭제하시겠습니까?\n데이터베이스의 관련 파일도 함께 제거됩니다. 이 작업은 되돌릴 수 없습니다.`,
        alertDeleteSuccess: "채용 공고가 성공적으로 삭제되었습니다.",
        alertDeleteError: (message: string) => `삭제 중 오류 발생: ${message}`,
        alertDeleteFailed: (message: string) => `삭제 실패: ${message}`,
        alertDeleteFailedGeneric: "채용 공고 삭제에 실패했습니다."
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

interface JobDetail {
    id: number;
    title: string;
    experience: string;
    location: string;
    employmentType: string;
    deadline: string | Date | null;
    isAlwaysRecruiting: boolean;
    createdAt: string | Date;
    content: string | null;
    files: FileData[];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.error("Supabase URL or Anon Key is missing in RecruitmentDetailPage.");
}
const ATTACHMENT_BUCKET_NAME = 'baro-studio';

export default function RecruitmentDetailPage() {
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

    const router = useRouter();
    const params = useParams();
    const jobId = params?.id as string;
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    const [downloadingFileId, setDownloadingFileId] = useState<number | null>(null);

    const {
        data: job,
        isLoading,
        error,
    } = useQuery<JobDetail, Error>({
        queryKey: ["job", jobId],
        queryFn: () => getQueryDetail(`/api/recruite/${jobId}`),
        enabled: !!jobId && !isNaN(parseInt(jobId, 10)),
    });

    const sanitizedHtml = useMemo(() => {
        if (typeof window !== 'undefined' && job?.content) {
            return DOMPurify.sanitize(job.content);
        }
        return job?.content || "";
    }, [job?.content]);

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/recruite/${jobId}`, {
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
            return response.json();
        },
        onSuccess: (data) => {
            if (data.success) {
                alert(t('alertDeleteSuccess'));
                queryClient.invalidateQueries({ queryKey: ['jobs'] });
                queryClient.removeQueries({ queryKey: ['job', jobId] });
                router.push("/company/recruitment");
                router.refresh();
            } else {
                throw new Error(t('alertDeleteFailedGeneric'));
            }
        },
        onError: (err) => {
            alert(t('alertDeleteError', err instanceof Error ? err.message : String(err)));
            console.error("Deletion error:", err);
        },
    });

    const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>, file: FileData) => {
        e.preventDefault();
        if (!supabase || downloadingFileId === file.id) return;

        setDownloadingFileId(file.id);
        try {
            const { data, error } = await supabase.storage
                .from(ATTACHMENT_BUCKET_NAME)
                .download(file.storagePath);

            if (error) throw new Error(t('alertDownloadError', error.message));

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
                throw new Error(t('alertDownloadNoData'));
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : t('alertDownloadUnknownError'));
            console.error("File download failed:", err);
        } finally {
            setDownloadingFileId(null);
        }
    };

    const handleDelete = () => {
        if (!job || deleteMutation.isPending) return;
        if (window.confirm(t('confirmDeleteJob', job.title))) {
            deleteMutation.mutate();
        }
    };


    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", width: "100%" }}>
                <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "80vh", width: "100%", color: "#dc2626", padding: "20px", textAlign: "center" }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>{t('errorTitle')}</h2>
                <p style={{ marginBottom: '1.5rem', maxWidth: '500px' }}>{error.message}</p>
                <Button onClick={() => router.push("/company/recruitment")} variant="outline">{t('errorGoBack')}</Button>
            </div>
        );
    }

    if (!job) {
        return (
            <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "80vh", width: "100%" }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>{t('notFoundTitle')}</h2>
                <Button onClick={() => router.push("/company/recruitment")} variant="outline">{t('errorGoBack')}</Button>
            </div>
        );
    }

    const formattedCreatedAt = job.createdAt ? format(new Date(job.createdAt), "yyyy-MM-dd HH:mm") : t('notAvailable');
    const formattedDeadline = job.isAlwaysRecruiting
        ? t('alwaysRecruiting')
        : (job.deadline ? format(new Date(job.deadline), "yyyy-MM-dd") : t('notSpecified'));

    return (
        <div className="max-w-7xl mx-auto" style={{ margin: "40px auto", padding: "32px", fontFamily: "'Inter', sans-serif", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}>

            <h1 style={{ fontSize: "32px", fontWeight: "700", color: '#111827', marginBottom: "12px", lineHeight: "1.3" }}>
                {job.title}
            </h1>

            <div style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between', fontSize: "14px", color: "#6b7280", marginBottom: "24px", borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                <span>{t('postedOn')} {formattedCreatedAt}</span>
                {
                    session && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button
                                variant="primaryBlue"
                                size="sm"
                                onClick={() => router.push(`/company/recruitment/update/${job.id}`)}
                                disabled={deleteMutation.isPending}
                                className="flex items-center gap-1.5"
                            >
                                <Edit className="h-4 w-4" />
                                <span>{t('editButton')}</span>
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="flex items-center gap-1.5"
                            >
                                {deleteMutation.isPending ? (
                                    <> <Loader2 className="h-4 w-4 animate-spin" /> {t('deletingButton')} </>
                                ) : (
                                    <> <Trash2 className="h-4 w-4" /> <span>{t('deleteButton')}</span> </>
                                )}
                            </Button>
                        </div>
                    )
                }

            </div>


            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(45%, 1fr))',
                gap: '15px',
                marginBottom: '32px',
                borderRadius: '8px',
                borderBottom: '1px solid #e5e7eb'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', backgroundColor: 'white', borderRadius: '6px', }}>
                    <Briefcase className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <span style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '3px' }}>{t('employmentTypeLabel')}</span>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>{job.employmentType || t('notAvailable')}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', backgroundColor: 'white', borderRadius: '6px', }}>
                    <UserCheck className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <span style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '3px' }}>{t('experienceLabel')}</span>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>{job.experience || t('notAvailable')}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', backgroundColor: 'white', borderRadius: '6px', }}>
                    <MapPin className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <span style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '3px' }}>{t('locationLabel')}</span>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>{job.location || t('notAvailable')}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', backgroundColor: 'white', borderRadius: '6px', }}>
                    <CalendarDays className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <span style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '3px' }}>{t('deadlineLabel')}</span>
                        <span style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: job.isAlwaysRecruiting ? '#059669' : '#1f2937',
                        }}>
                            {formattedDeadline}
                        </span>
                    </div>
                </div>
            </div>

            {sanitizedHtml && (
                <div
                    className="prose prose-slate max-w-none lg:prose-base"
                    style={{ marginBottom: "32px", lineHeight: "1.75" }}
                    dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                />
            )}

            {job.files && job.files.length > 0 && (
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px", marginBottom: "32px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: '#111827', marginBottom: "16px" }}>
                        {t('attachmentsTitle')}
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {job.files.map((file) => (
                            <li key={file.id}
                                style={{ display: "flex", alignItems: "center", justifyContent: 'space-between', padding: "12px 16px", border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#fff' }}>
                                <a
                                    href={file.url}
                                    onClick={(e) => handleDownload(e, file)}
                                    style={{ display: 'flex', alignItems: 'center', color: "#2563eb", textDecoration: "none", fontSize: "14px", marginRight: '16px', cursor: 'pointer', fontWeight: '500', flexGrow: 1, minWidth: 0 }}
                                    title={t('downloadFileTitle', file.filename)}
                                >
                                    {downloadingFileId === file.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" style={{ marginRight: "10px", color: '#6b7280' }} />
                                    ) : (
                                        <FileText className="h-4 w-4 flex-shrink-0" style={{ marginRight: "10px", color: '#6b7280' }} />
                                    )}
                                    <span className="truncate hover:underline">{file.filename}</span>
                                </a>
                                <span style={{ fontSize: "13px", color: "#6b7280", whiteSpace: 'nowrap', marginLeft: 'auto', paddingLeft: '16px', flexShrink: 0 }}>
                                    {formatBytes(file.sizeBytes)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                <button
                    onClick={() => router.push("/company/recruitment")}
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