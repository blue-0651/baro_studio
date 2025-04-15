'use client';
import JobForm from "@/components/recruit/recruitment-form";
import { useLang } from "@/context/LangContext";
import { getQueryDetail } from "@/app/api/query/api.js";
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
type Language = 'kr' | 'en';

interface JobDetail {
    id?: number;
    title: string;
    experience: string;
    location: string;
    employmentType: string;
    deadline?: string | null;
    isAlwaysRecruiting: boolean;
    content: string | null;
    files: ExistingFileData[];
}
interface ExistingFileData {
    id: number;
    filename: string;
    url: string;
    storagePath: string;
    sizeBytes: number;
    mimeType?: string;
}

type TranslationEntry = {
    [key in Language]: string;
};


type HomeTranslations = {
    pageTitle: TranslationEntry;
    pageSubtitle: TranslationEntry;

};

export default function EditPostPage() {

    const { lang } = useLang() as { lang: Language };
    const params = useParams()
    const router = useRouter();
    const jobId = params?.id as string
    const numericJobId = jobId ? parseInt(jobId, 10) : NaN;

    const translationsUpdate = {
        pageTitle: {
            kr: '채용공고 수정',
            en: 'Edit Job Posting'
        },
        pageSubtitle: {
            kr: '기존 채용공고의 내용을 수정합니다.',
            en: 'Edit the details of this job posting.'
        },
    };

    const {
        data: job,
        isLoading,
        error,
        isError
    } = useQuery<JobDetail, Error>({
        queryKey: ["job", numericJobId],
        queryFn: () => getQueryDetail(`/api/recruite/${numericJobId}`),
        enabled: !isNaN(numericJobId)
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-600">Loading job details...</span>
            </div>
        );
    }
    if (isError || !job) {
        return (
            <div className="text-center py-10">
                <p className="text-red-600 font-semibold">Error loading job details.</p>
                {error && <p className="text-sm text-gray-500 mt-1">{error.message}</p>}
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div>
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10" style={{ backgroundColor: "FFFBF5", paddingBottom: "3rem" }}>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                            <h1 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl mt-12 md:text-5xl">
                                <span className="block" style={{ color: "#333333" }}>
                                    {translationsUpdate.pageTitle[lang]}
                                </span>
                                <span className="block text-custom text-lg sm:text-xl md:text-2xl mt-2">
                                    {translationsUpdate.pageSubtitle[lang]}
                                </span>
                            </h1>

                        </div>
                    </div>
                </div>
            </section>
            <JobForm
                mode="update"
                initialData={job}
                jobId={parseInt(jobId, 10)} />
        </div>
    )
}
