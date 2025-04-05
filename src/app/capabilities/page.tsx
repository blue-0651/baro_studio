'use client';

import { useLang } from '@/context/LangContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CapabilitiesPage() {
  const { lang } = useLang();
  
  const capabilityTypes = [
    {
      id: 'cnc',
      name: 'CNC Machining',
      description: 'Tight tolerances and finishing capabilities, manufactured in one day.',
      image: '/card1.png',
    },
    {
      id: 'injection',
      name: 'Injection Molding',
      description: 'Production-grade resin tooling, as fast as possible.',
      image: '/card2.png',
    },
    {
      id: '3d-printing',
      name: '3D Printing',
      description: 'FDM, SLA, SLS, PolyJet, MJF technologies.',
      image: '/card3.png',
    },
    {
      id: 'urethane',
      name: 'Urethane Casting',
      description: 'Production-quality parts without the tooling investment.',
      image: '/card4.png',
    },
    {
      id: 'sheet-metal',
      name: 'Sheet Metal',
      description: 'Experience the versatility & cost efficiency with flexible application options.',
      image: '/card5.png',
    },
    {
      id: 'compression',
      name: 'Compression Molding',
      description: 'Experience lower tooling costs with high-quality durable parts.',
      image: '/card1.png',
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-8xl mx-auto">
          <div className="relative z-10" style={{ backgroundColor: "#EFEFEF", paddingBottom: "3rem" }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
              <h1 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl mt-12 md:text-5xl">
                <span className="block" style={{ color: "#333333" }}>
                  {lang === 'kr' ? '핵심역량' : 'Our Capabilities'}
                </span>
                <span className="block text-custom text-lg sm:text-xl md:text-2xl mt-2">
                  {lang === 'kr' ? '최고의 제조 서비스' : 'Manufacturing Excellence'}
                </span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                {lang === 'kr' 
                  ? '빠르고 정확한 제조 솔루션으로 비즈니스 성장을 지원합니다.' 
                  : 'Supporting your business growth with fast and precise manufacturing solutions.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {lang === 'kr' ? '제조 역량' : 'Manufacturing Services'}
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              {lang === 'kr' 
                ? '다양한 제조 서비스로 귀하의 아이디어를 현실로 만들어 드립니다.' 
                : 'Turn your ideas into reality with our diverse manufacturing services.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilityTypes.map((capability) => (
              <Link href={`/capabilities/${capability.id}`} key={capability.id}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48">
                    <Image
                      src={capability.image}
                      alt={capability.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{capability.name}</h3>
                    <p className="text-gray-600">{capability.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {lang === 'kr' ? '왜 BARO를 선택해야 할까요?' : 'Why Choose BARO?'}
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              {lang === 'kr' 
                ? '제조 파트너로서 최고의 서비스를 제공합니다.' 
                : 'We provide the best service as your manufacturing partner.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {lang === 'kr' ? '빠른 제조' : 'Fast Manufacturing'}
              </h3>
              <p className="text-gray-600">
                {lang === 'kr' 
                  ? '빠른 납기로 귀하의 시간을 절약해 드립니다.' 
                  : 'Save your time with our rapid delivery.'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {lang === 'kr' ? '정확한 품질' : 'Precise Quality'}
              </h3>
              <p className="text-gray-600">
                {lang === 'kr' 
                  ? '엄격한 품질 관리로 정확한 제품을 제공합니다.' 
                  : 'Deliver precise products with strict quality control.'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {lang === 'kr' ? '경쟁력 있는 가격' : 'Competitive Pricing'}
              </h3>
              <p className="text-gray-600">
                {lang === 'kr' 
                  ? '합리적인 가격으로 최고의 가치를 제공합니다.' 
                  : 'Provide the best value at reasonable prices.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 