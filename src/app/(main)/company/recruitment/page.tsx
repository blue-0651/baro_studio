"use client";

import Recruitment from "@/components/recruit/recruitement";
import { useLang } from "@/context/LangContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at BARO Studio | Join Our Prototype Manufacturing Team",
  description: "Join BARO Studio's team of experts in rapid prototyping, injection molding, and custom manufacturing solutions. 바로 스튜디오의 전문가 팀에 합류하여 신속한 프로토타이핑, 사출 성형 및 맞춤형 제조 솔루션을 함께 만들어가세요.",
  keywords: "BARO careers, prototype manufacturing jobs, rapid prototyping careers, injection molding jobs, 바로 스튜디오 채용, 프로토타입 제조 직무, 신속 프로토타이핑 경력, 사출성형 직무",
};

type Language = 'kr' | 'en';

type TranslationEntry = {
    [key in Language]: string;
};

type HomeTranslations = {
    pageTitle: TranslationEntry;
    pageSubtitle: TranslationEntry;

};

export default function RecruitmentPage() {
    const { lang } = useLang() as { lang: Language };

    const translationsList = {
        pageTitle: {
            kr: '채용공고',
            en: 'Job Postings'
        },
        pageSubtitle: {
            kr: '함께 성장할 인재를 기다립니다.',
            en: 'We are looking for talented individuals to grow with us.'
        },
    };

    return (
        <div>
            <section className="relative overflow-hidden">
                <div className="max-w-8xl mx-auto">
                    <div className="relative z-10" style={{ backgroundColor: "#FFFBF5", paddingBottom: "3rem" }}>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                            <h1 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl mt-12 md:text-5xl">
                                <span className="block" style={{ color: "#333333" }}>
                                    {translationsList.pageTitle[lang]}
                                </span>
                                <span className="block text-custom text-lg sm:text-xl md:text-2xl mt-2">
                                    {translationsList.pageSubtitle[lang]}
                                </span>
                            </h1>

                        </div>
                    </div>
                </div>
            </section>
            <Recruitment />
        </div>
    )
}