"use client";

import QuoteForm from "@/components/quote/quote";
import { useLang } from "@/context/LangContext";

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
        <main className="pt-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b pb-4">
                        {translations.pageTitle[lang]}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {translations.pageSubtitle[lang]}
                    </p>
                </div>

                <QuoteForm />

                <div className="mt-12 text-center text-sm text-gray-500">
                    <p>{translations.responseTime[lang]}</p>
                    <p>{translations.urgentContact[lang]}</p>
                </div>
            </div>
        </main>
    )
}