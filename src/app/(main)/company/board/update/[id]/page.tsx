"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import PostForm from "@/components/board/board-form"
import { getQueryDetail } from "@/app/api/query/api.js";
import { useLang } from "@/context/LangContext";
type Language = 'kr' | 'en';

type TranslationEntry = {
    [key in Language]: string;
};

type HomeTranslations = {
    pageTitle: TranslationEntry;
    pageSubtitle: TranslationEntry;

};



const translationsUpdate: HomeTranslations = {
    pageTitle: {
        kr: '공지사항 수정',
        en: 'Edit Notice'
    },
    pageSubtitle: {
        kr: '기존 공지사항의 내용을 변경합니다.',
        en: 'Edit the details of this announcement.'
    },
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
    manager?: {
        id: string;
        name?: string;
    };
    files: FileData[];
}

export default function BoardUpdatePage() {
    const router = useRouter();
    const params = useParams();
    const { lang } = useLang() as { lang: Language };
    const boardId = params?.id as string

    const {
        data: post,
        isLoading,
        error,
        isFetching,
    } = useQuery<Post, Error>({
        queryKey: ["post", boardId],
        queryFn: () => getQueryDetail(`/api/board/${boardId}`),
        enabled: !!boardId && !isNaN(parseInt(boardId, 10)),
    });

    if (isLoading || isFetching) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500">게시글 정보 로딩 중...</p>
            </div>
        );
    }

    // 에러 처리
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
                <p className="text-red-600 font-semibold mb-2">데이터 로딩 중 오류가 발생했습니다.</p>
                <p className="text-sm text-red-500 mb-4">{error.message}</p>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                >
                    뒤로 가기
                </button>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
                <p className="text-gray-600 font-semibold mb-4">게시글을 찾을 수 없습니다.</p>
                <button
                    onClick={() => router.push('/company/board')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                    목록으로 돌아가기
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
            <PostForm
                mode="update"
                initialData={post}
                boardId={boardId}
            />
        </div>
    );
}