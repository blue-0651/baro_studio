'use client';
import { useLang } from "@/context/LangContext";
import BoardDetail from "@/components/board/boardDetail";
type Language = 'kr' | 'en';

type TranslationEntry = {
    [key in Language]: string;
};

type HomeTranslations = {
    pageTitle: TranslationEntry;
    pageSubtitle: TranslationEntry;

};

export default function BoardDetailPage() {
    const { lang } = useLang() as { lang: Language };

    const translations: HomeTranslations = {
        pageTitle: { kr: '공지사항', en: 'Notices' },
        pageSubtitle: { kr: '중요한 소식과 업데이트를 확인하세요.', en: 'Check here for important news and updates.' },
    };
    return (
        <>
            <section className="relative overflow-hidden">
                <div className="max-w-8xl mx-auto">
                    <div className="relative z-10" style={{ backgroundColor: "FFFBF5", paddingBottom: "3rem" }}>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                            <h1 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl mt-12 md:text-5xl">
                                <span className="block" style={{ color: "#333333" }}>
                                    {translations.pageTitle[lang]}
                                </span>
                                <span className="block text-custom text-lg sm:text-xl md:text-2xl mt-2">
                                    {translations.pageSubtitle[lang]}
                                </span>
                            </h1>

                        </div>
                    </div>
                </div>
            </section>
            <BoardDetail />
        </>
    )
}