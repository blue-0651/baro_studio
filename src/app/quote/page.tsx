"use client";

import QuoteForm from "@/components/quote/quote";
import { useLang } from "@/context/LangContext";
import Image from "next/image";

type Language = 'kr' | 'en';

type TranslationEntry = {
    [key in Language]: string;
};

type HomeTranslations = {
    pageTitle: TranslationEntry;
    pageSubtitle: TranslationEntry;
    responseTime: TranslationEntry;
    urgentContact: TranslationEntry;
};

export default function Home() {
    const { lang } = useLang() as { lang: Language };

    const translations: HomeTranslations = {
        pageTitle: { kr: '견적 요청', en: 'Request Quote' },
        pageSubtitle: { kr: '최적의 제조 솔루션을 제공해 드리겠습니다', en: 'We will provide the optimal manufacturing solution' },
        responseTime: { kr: '견적 요청 후 1-2영업일 이내에 답변드리겠습니다.', en: 'We will respond within 1-2 business days after receiving your quote request.' },
        urgentContact: { kr: '긴급한 문의사항은 전화 또는 이메일로 연락 부탁드립니다.', en: 'For urgent inquiries, please contact us by phone or email.' }
    };

    return (
        <div>
            {/* Hero Section - Company 페이지와 동일한 스타일 적용 */}
            <section className="relative overflow-hidden">
                <div className="max-w-8xl mx-auto">
                    <div className="relative z-10" style={{ paddingBottom: "3rem" }}>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                            <h1 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl mt-12 md:text-5xl">
                                <span className="block" style={{ color: "#333333" }}>
                                    {translations.pageTitle[lang]}
                                </span>
                                <span className="block text-custom text-lg sm:text-xl md:text-2xl mt-2">
                                    {translations.pageSubtitle[lang]}
                                </span>
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                                {translations.responseTime[lang]}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote Form Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <QuoteForm />
                    
                    <div className="mt-12 text-center text-sm text-gray-500">
                        <p>{translations.urgentContact[lang]}</p>
                    </div>
                </div>
            </section>
        </div>
    )
}