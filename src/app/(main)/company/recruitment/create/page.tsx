'use client';
import JobForm from "@/components/recruit/recruitment-form";
import { useLang } from "@/context/LangContext";

type Language = 'kr' | 'en';

type TranslationEntry = {
    [key in Language]: string;
};

type HomeTranslations = {
    pageTitle: TranslationEntry;
    pageSubtitle: TranslationEntry;

};

export default function CreatePostPage() {

    const { lang } = useLang() as { lang: Language };

    const translationsCreate = {
        pageTitle: {
            kr: '새 채용공고 작성',
            en: 'Create New Job Posting'
        },
        pageSubtitle: {
            kr: '채용 정보를 입력하여 새로운 공고를 등록하세요.',
            en: 'Enter the job details to create a new posting.'
        },
    };
    return (
        <div>
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10" style={{ backgroundColor: "FFFBF5", paddingBottom: "3rem" }}>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                            <h1 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl mt-12 md:text-5xl">
                                <span className="block" style={{ color: "#333333" }}>
                                    {translationsCreate.pageTitle[lang]}
                                </span>
                                <span className="block text-custom text-lg sm:text-xl md:text-2xl mt-2">
                                    {translationsCreate.pageSubtitle[lang]}
                                </span>
                            </h1>

                        </div>
                    </div>
                </div>
            </section>
            <JobForm mode="create" />
        </div>
    )
}
