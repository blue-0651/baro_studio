'use client';

import { useLang } from '@/context/LangContext';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

type Language = 'kr' | 'en';

type Capability = {
  id: string;
  name: { [key in Language]: string }; 
  description: { [key in Language]: string };
  image: string;
};

export const metadata: Metadata = {
  title: "Manufacturing Capabilities | BARO Studio Prototype Services",
  description: "BARO Studio offers Proto type & low volume production services including CNC machining, injection molding, compression molding, 3D printing, and rapid tooling. 바로 스튜디오는 CNC 가공, 사출 성형, 압축 성형, 3D 프린팅 및 신속한 툴링 서비스를 포함한, 프로토타입 및 소량 생산 서비스를 제공합니다.",
  keywords: "CNC machining, injection molding, compression molding, 3D printing, rapid prototyping, quick turn tooling, over molding, low volume production, custom prototype, CNC 가공, 사출 성형, 압축 성형, 3D 프린팅, 신속 프로토타이핑, 퀵턴 툴링, 오버몰딩, 소량생산, 맞춤형 프로토타입",
};

export default function CapabilitiesPage() {
  const { lang } = useLang() as { lang: Language };

  const capabilityTypes: Capability[] = [
    {
      id: 'cnc',
      name: {
        kr: 'CNC 가공',
        en: 'CNC Machining',
      },
      description: {
        kr: '엄격한 공차 및 마감 처리, 하루 만에 제조 가능.',
        en: 'Tight tolerances and finishing capabilities, manufactured in one day.',
      },
      image: '/card1.png',
    },
    {
      id: 'injection',
      name: {
        kr: '사출 성형',
        en: 'Injection Molding',
      },
      description: {
        kr: '양산 등급 수지 금형, 최대한 빠른 제작.',
        en: 'Production-grade resin tooling, as fast as possible.',
      },
      image: '/card2.png',
    },
    {
      id: 'metal-stamping',
      name: {
        kr: '금속 스탬핑',
        en: 'Metal Stamping',
      },
      description: {
        kr: '제조 요구에 맞는 고품질 금속 스탬핑 솔루션.',
        en: 'High-quality metal stamping solutions for your manufacturing needs.',
      },
      image: '/card5.png',
    },
    {
      id: 'compression',
      name: {
        kr: '압축 성형',
        en: 'Compression Molding',
      },
      description: {
        kr: '고품질 내구성 부품으로 금형 비용 절감을 경험하세요.',
        en: 'Experience lower tooling costs with high-quality durable parts.',
      },
      image: '/card1.png', 
    },
    {
      id: '3d-printing',
      name: {
        kr: '3D 프린팅',
        en: '3D Printing',
      },
      description: {
        kr: 'FDM, SLA, SLS, PolyJet, MJF 기술 지원.',
        en: 'FDM, SLA, SLS, PolyJet, MJF technologies.',
      },
      image: '/card3.png',
    },
    {
      id: 'urethane',
      name: {
        kr: '우레탄 캐스팅',
        en: 'Urethane Casting',
      },
      description: {
        kr: '금형 투자 없이 양산 품질의 부품 제작.',
        en: 'Production-quality parts without the tooling investment.',
      },
      image: '/card4.png',
    }
  ];

  const translations = {
    heroTitle: { kr: '핵심역량', en: 'Our Capabilities' },
    heroSubtitle: { kr: '최고의 제조 서비스', en: 'Manufacturing Excellence' },
    heroDescription: { kr: '빠르고 정확한 제조 솔루션으로 비즈니스 성장을 지원합니다.', en: 'Supporting your business growth with fast and precise manufacturing solutions.' },
    overviewTitle: { kr: '제조 역량', en: 'Manufacturing Services' },
    overviewDescription: { kr: '다양한 제조 서비스로 귀하의 아이디어를 현실로 만들어 드립니다.', en: 'Turn your ideas into reality with our diverse manufacturing services.' },
    whyChooseTitle: { kr: '왜 BARO를 선택해야 할까요?', en: 'Why Choose BARO?' },
    whyChooseSubtitle: { kr: '제조 파트너로서 최고의 서비스를 제공합니다.', en: 'We provide the best service as your manufacturing partner.' },
    featureFastTitle: { kr: '빠른 제조', en: 'Fast Manufacturing' },
    featureFastDesc: { kr: '빠른 납기로 귀하의 시간을 절약해 드립니다.', en: 'Save your time with our rapid delivery.' },
    featureQualityTitle: { kr: '정확한 품질', en: 'Precise Quality' },
    featureQualityDesc: { kr: '엄격한 품질 관리로 정확한 제품을 제공합니다.', en: 'Deliver precise products with strict quality control.' },
    featurePriceTitle: { kr: '경쟁력 있는 가격', en: 'Competitive Pricing' },
    featurePriceDesc: { kr: '합리적인 가격으로 최고의 가치를 제공합니다.', en: 'Provide the best value at reasonable prices.' },
  };

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="max-w-8xl mx-auto">
          <div className="relative z-10 pb-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
              <h1 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl mt-12 md:text-5xl">
                <span className="block" style={{ color: "#333333" }}>
                  {translations.heroTitle[lang]}
                </span>
                <span className="block text-custom text-lg sm:text-xl md:text-2xl mt-2">
                  {translations.heroSubtitle[lang]}
                </span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                {translations.heroDescription[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {translations.overviewTitle[lang]}
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              {translations.overviewDescription[lang]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilityTypes.map((capability) => (
              <Link href={`/capabilities/${capability.id}`} key={capability.id}>
                <div className="block bg-white rounded-lg shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48">
                    <Image
                      src={capability.image}
                      alt={capability.name[lang]} 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {capability.name[lang]} 
                    </h3>
                    <p className="text-gray-600">
                      {capability.description[lang]} 
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
             {translations.whyChooseTitle[lang]}
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              {translations.whyChooseSubtitle[lang]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {translations.featureFastTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {translations.featureFastDesc[lang]}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {translations.featureQualityTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {translations.featureQualityDesc[lang]}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {translations.featurePriceTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {translations.featurePriceDesc[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}