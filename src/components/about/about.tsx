'use client'
import Image from "next/image";
import SimpleImageSlider from "./aboutImageSlider";
import { useLang } from "@/context/LangContext"; 

type Language = 'kr' | 'en';

// 번역 항목 타입 정의
type TranslationEntry = {
    [key in Language]: string;
};

type AboutTranslations = {
    heroTitle1: TranslationEntry;
    heroTitle2: TranslationEntry;
    heroSubtitle: TranslationEntry;
    companyOverviewTitle: TranslationEntry;
    companyOverviewPara1: TranslationEntry;
    companyOverviewPara2: TranslationEntry;
    companyOverviewPara3: TranslationEntry;
    companyOverviewPara4: TranslationEntry;
    companyOverviewPara5: TranslationEntry;
    companyOverviewPara6: TranslationEntry;
    companyOverviewPara7: TranslationEntry;
    companyOverviewPara8: TranslationEntry;
    companyOverviewPara9: TranslationEntry;
    companyOverviewPara10: TranslationEntry;
    companyOverviewPara11: TranslationEntry;
    companyOverviewPara12: TranslationEntry;
    coreValuesTitle: TranslationEntry;
    coreValuesSubtitle: TranslationEntry;
    coreValueSpeedTitle: TranslationEntry;
    coreValueSpeedDesc: TranslationEntry;
    coreValueQualityTitle: TranslationEntry;
    coreValueQualityDesc: TranslationEntry;
    coreValueInnovationTitle: TranslationEntry;
    coreValueInnovationDesc: TranslationEntry;
    growthStoryTitle: TranslationEntry;
    growthStorySubtitle: TranslationEntry;
    growthYear2008: TranslationEntry;
    growthEvent2008_1: TranslationEntry;
    growthEvent2008_2: TranslationEntry;
    growthYear2015: TranslationEntry;
    growthEvent2015_1: TranslationEntry;
    growthEvent2015_2: TranslationEntry;
    growthYear2023: TranslationEntry;
    growthEvent2023_1: TranslationEntry;
    growthEvent2023_2: TranslationEntry;
    newCompanyTitle: TranslationEntry;
    newCompanySubtitle: TranslationEntry;

};


export default function About() {
    const { lang } = useLang() as { lang: Language }; 

    const companyExteriorImages = [
        "/about1.png",
        "/about2.png",
        "/about3.png",
    ];

    // 번역 객체 정의
    const translations: AboutTranslations = {
        heroTitle1: { kr: '회사 소개', en: 'About BARO' },
        heroTitle2: { kr: '우리의 이야기 & 비전', en: 'Our Story & Vision' },
        heroSubtitle: { kr: '2008년부터 BARO는 혁신적인 기계 제조의 선두에 서서 제품 디자이너와 엔지니어들이 아이디어를 신속하게 구현할 수 있도록 지원해왔습니다.', en: 'Since 2008, BARO has been at the forefront of innovative machine manufacturing, supporting product designers and engineers to quickly bring their ideas to life.' },
        companyOverviewTitle: { kr: '회사 소개', en: 'Our Company' },
        companyOverviewPara1: { kr: '제품 디자이너와 엔지니어들이 새로운 제품을 즉시 받아보고 선보일 수 있도록 돕는 BARO는 가능성의 세계를 열고 힘을 여러분의 손 안에 쥐어드리고자 노력합니다 - 이것이 BARO 혁신의 핵심입니다.', en: 'Helping Product designers and engineers receive and showcase new products in no time, BARO strives to open a world of possibilities and leaves the power in the palm of your hands - this is the core of BARO\'s revolution.' },
        companyOverviewPara2: { kr: 'BARO는 기계 부품의 속도, 품질, 혁신을 선도합니다. 신속한 기계 가공을 제공하고 제품 개발 주기를 최소화하여 제품 개발의 무한한 미래를 엽니다.', en: 'BARO is leading in speed, quality, and innovation for mechanical components. It opens the future to unlimited options in product development by providing quick turn mechanical fabrication and minimizing the product development cycle.' },
        companyOverviewPara3: { kr: '2008년부터 한국 시장을 지원해왔으며, 이제 한국의 정신인 빨리빨리와 정(情)으로 모든 글로벌 시장에 서비스를 제공하기 위해 전속력으로 확장하고 나아가고 있습니다.', en: 'We support local Korea market since 2008 and are now expanding and moving at full speed to service all global markets with Korean ethos, Ppallippalli, and Jeong.' },
        companyOverviewPara4: { kr: 'BARO는 한국어로 \'즉시\'를 의미하며, 빨리빨리는 한국 문화와 정신에서 \'서두르다\'는 뜻입니다. 속도는 정밀 기계 제조를 제공하는 데 있어 최우선 순위이며, 고객의 제품 개발을 지원하기 위해 높은 충실도의 결과를 달성합니다.', en: 'BARO means \'immediately\' and Ppallippalli means \'hurry up\' in Korean culture and ethos. Speed is our top priority to deliver on precision mechanical manufacturing, achieving high fidelity results to support customers\' product development.' },
        companyOverviewPara5: { kr: '또한 우리는 오랜 비즈니스 관계를 구축하기 위한 공동체 중심의 한국 \'정(情)\' 문화를 강조하고자 합니다. 정은 사람들을 하나로 묶는 보이지 않는 포옹을 나타냅니다. 이는 대인 관계 내에서 발전하는 유대감과 애착을 촉진합니다. 우리는 이를 할인, 신속 처리 옵션, 드롭 오프 서비스 등을 통한 유연성을 제공함으로써 비즈니스에 반영합니다.', en: 'We also want to highlight our Korean \'Jeong\' culture, centered in community to establish long-lasting business relationships. Jeong represents an invisible hug that brings people together. It promotes bonding and attachments that develop within interpersonal relationships. We translate that into our business by offering flexibility through discounts, options to expedite, and drop off services.' },
        companyOverviewPara6: { kr: '지속적인 투자와 연구 개발을 통해 첨단 제조 시스템을 운영하면서 BARO는 글로벌 시장을 선도하고 고객에게 최고 품질의 결과를 제공하기 위해 노력합니다.', en: 'By continuously investing and researching in our development while operating high tech manufacturing systems, BARO strives to lead in the global market and offer top quality results to our customers.' },
        companyOverviewPara7: { kr: 'BARO는 속도, 품질, 기술에서 미래 성장 동력을 확보하여 경쟁사보다 앞선 완전한 기술적 우위를 제공하며, 이는 우리의 차별성을 정의합니다.', en: 'BARO offers complete technological advantage ahead of the competition by securing future growth power in speed, quality and technologies that define our differentiation.' },
        companyOverviewPara8: { kr: 'BARO는 세계적인 글로벌 기업이 되기 위해 노력하며 모든 직원이 자신의 기술을 극대화할 수 있는 훌륭한 환경을 제공합니다. 우리의 인재 팀은 회사의 가장 큰 초점입니다. 직원들은 우리의 목표를 달성하기 위해 열심히 일합니다. 우리는 그들을 전폭적으로 지원하며 올바른 태도, 근면성, 성실함으로 무엇이든 이룰 수 있다고 믿습니다.', en: 'BARO strives to be a world-class global company and provides an excellent environment where all employees can maximize their skills. Our team of people is the company\'s biggest focus. Our employees work hard to accomplish our goals. We fully support them and believe we can achieve anything with the right attitude, diligence, and sincerity.' },
        companyOverviewPara9: { kr: '품질은 우리의 가장 중요한 목표이며, BARO는 완벽한 품질 결과를 달성하기 위해 역량을 집중합니다.', en: 'Quality is our most important objective, BARO concentrates its capabilities to achieve perfect quality results.' },
        companyOverviewPara10: { kr: '우리의 공정은 모든 작업 환경에서 가장 중요한 요소로서 완전한 환경 안전을 최우선으로 고려합니다. BARO는 우리 팀과 제품의 안전을 위해 최선을 다합니다.', en: 'Our process takes into consideration full environmental safety as a priority and the most important element in any workplace environment. BARO is committed to safety for our team and products.' },
        companyOverviewPara11: { kr: 'BARO는 제조 현장에서 귀하의 요청을 완벽하게 처리합니다. 문제가 발견될 경우 신속하게 분석, 재조정하고 빠르고 정확하게 해결할 수 있습니다.', en: 'BARO fully processes your requests at the manufacturing site. If ever a problem is found, we are able to quickly analyze, readjust, and resolve it quickly and accurately.' },
        companyOverviewPara12: { kr: '초점을 잃지 않는 근면과 성실함, 개선에 대한 열정과 미래를 향한 도전 정신, 뛰어난 속도, 기술, 품질로 세상을 감동시키는 BARO, 당신이 신뢰할 수 있는 회사가 바로 곁에 있을 것입니다.', en: 'Diligence and sincerity without losing focus, a passion for improvement and spirit of challenge for the future, inspiring the world with outstanding speed, technology, and quality, BARO, a company that you can trust will be right by your side.' },
        coreValuesTitle: { kr: 'BARO의 핵심 가치', en: 'BARO\'s Core Values' },
        coreValuesSubtitle: { kr: '혁신적인 제조 공정을 통한 고객 성공 지원', en: 'Supporting customer success through innovative manufacturing processes' },
        coreValueSpeedTitle: { kr: '속도', en: 'Speed' },
        coreValueSpeedDesc: { kr: '업계 최고의 납기 속도로 시간을 절약하세요', en: 'Save time with industry-leading delivery speeds' },
        coreValueQualityTitle: { kr: '품질', en: 'Quality' },
        coreValueQualityDesc: { kr: '최고 품질의 제품만을 약속드립니다', en: 'We promise to deliver only the highest quality products' },
        coreValueInnovationTitle: { kr: '혁신', en: 'Innovation' },
        coreValueInnovationDesc: { kr: '지속적인 혁신을 통해 미래를 선도합니다', en: 'Leading the future through continuous innovation' },
        growthStoryTitle: { kr: 'BARO의 성장 스토리', en: 'BARO\'s Growth Story' },
        growthStorySubtitle: { kr: '2008년부터 이어진 혁신의 여정', en: 'A Journey of Innovation Since 2008' },
        growthYear2008: { kr: '2008', en: '2008' },
        growthEvent2008_1: { kr: '한국 시장 진출', en: 'Korean Market Entry' },
        growthEvent2008_2: { kr: '서울에 BARO 설립', en: 'BARO established in Seoul' },
        growthYear2015: { kr: '2015', en: '2015' },
        growthEvent2015_1: { kr: '기술 혁신', en: 'Tech Innovation' },
        growthEvent2015_2: { kr: '스마트 제조 시스템 도입', en: 'Smart Manufacturing System Implementation' },
        growthYear2023: { kr: '2023', en: '2023' },
        growthEvent2023_1: { kr: '글로벌 확장', en: 'Global Expansion' },
        growthEvent2023_2: { kr: '글로벌 시장 진출', en: 'Global Market Entry' },
        newCompanyTitle: { kr: '우리의 새로운 사옥', en: 'Our New Company' },
        newCompanySubtitle: { kr: '바로 스튜디오 외관', en: 'Baro Studio Exterior' },

    };

    return (
        <div >
            {/* About Hero Section */}
            <section className="relative overflow-hidden ">
                <div className="max-w-8xl mx-auto">
                    <div className="relative z-10 pb-12">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                            <h1 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl mt-12 md:text-5xl">
                                <span className="block" style={{ color: "#333333" }}>{translations.heroTitle1[lang]}</span>
                                <span className="block text-custom">{translations.heroTitle2[lang]}</span>
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                                {translations.heroSubtitle[lang]}
                            </p>
                        </div>
                        <div className="relative w-full h-96 sm:h-96 md:h-96 lg:h-[42rem]">
                            <Image
                                src="/main3.png"
                                alt="BARO Manufacturing Facility" // Alt text는 번역이 덜 중요할 수 있음
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Overview */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
                        {/* 왼쪽 열 - 텍스트 내용 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{translations.companyOverviewTitle[lang]}</h2>
                            <p className="mt-4 text-lg text-gray-500">
                                {translations.companyOverviewPara1[lang]}
                            </p>
                            <p className="mt-4 text-lg text-gray-500">
                                {translations.companyOverviewPara2[lang]}
                            </p>
                            <p className="mt-4 text-lg text-gray-500">
                                {translations.companyOverviewPara3[lang]}
                            </p>
                        </div>
                        {/* 오른쪽 열 - 이미지 */}
                        <div className="mt-10 lg:mt-0">
                            <Image
                                src="/about3.png"
                                alt="BARO Headquarters" // Alt text
                                width={600}
                                height={450}
                                className="rounded-lg shadow-lg"
                                style={{ objectFit: "cover", width: "100%", height: "24rem" }}
                            />
                        </div>
                    </div>

                    {/* 하단 전체 너비 콘텐츠 */}
                    <div className="mt-6 text-lg text-gray-500">
                        <p className="mt-4 text-lg text-gray-500">
                            {translations.companyOverviewPara4[lang]}
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                           {translations.companyOverviewPara5[lang]}
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                           {translations.companyOverviewPara6[lang]}
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            {translations.companyOverviewPara7[lang]}
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            {translations.companyOverviewPara8[lang]}
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            {translations.companyOverviewPara9[lang]}
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                           {translations.companyOverviewPara10[lang]}
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            {translations.companyOverviewPara11[lang]}
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            {translations.companyOverviewPara12[lang]}
                        </p>
                    </div>
                </div>
            </section>

            {/* BARO's Core Values */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">{translations.coreValuesTitle[lang]}</h2>
                        <p className="mt-4 text-lg text-gray-500">
                            {translations.coreValuesSubtitle[lang]}
                        </p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="text-custom">
                                <i className="fas fa-bolt text-3xl"></i>
                            </div>
                            <h3 className="mt-6 text-xl font-medium text-gray-900">{translations.coreValueSpeedTitle[lang]}</h3>
                            <p className="mt-4 text-gray-500">{translations.coreValueSpeedDesc[lang]}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="text-custom">
                                <i className="fas fa-check-circle text-3xl"></i>
                            </div>
                            <h3 className="mt-6 text-xl font-medium text-gray-900">{translations.coreValueQualityTitle[lang]}</h3>
                            <p className="mt-4 text-gray-500">{translations.coreValueQualityDesc[lang]}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="text-custom">
                                <i className="fas fa-lightbulb text-3xl"></i>
                            </div>
                            <h3 className="mt-6 text-xl font-medium text-gray-900">{translations.coreValueInnovationTitle[lang]}</h3>
                            <p className="mt-4 text-gray-500">{translations.coreValueInnovationDesc[lang]}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BARO's Growth Story */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">{translations.growthStoryTitle[lang]}</h2>
                        <p className="mt-4 text-lg text-gray-500">{translations.growthStorySubtitle[lang]}</p>
                    </div>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200"></div>
                        <div className="relative z-10">
                            <div className="flex items-center mb-12">
                                <div className="flex-1 text-right pr-8">
                                    <h3 className="font-bold text-lg" style={{ color: '#333333' }}>{translations.growthYear2008[lang]}</h3>
                                    <p className="text-gray-500">{translations.growthEvent2008_1[lang]}</p>
                                </div>
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'skyBlue' }}></div>
                                <div className="flex-1 pl-8">
                                    <p style={{ color: '#333333' }}>{translations.growthEvent2008_2[lang]}</p>
                                </div>
                            </div>
                            <div className="flex items-center mb-12">
                                <div className="flex-1 text-right pr-8">
                                    <h3 className="font-bold text-lg" style={{ color: '#333333' }}>{translations.growthYear2015[lang]}</h3>
                                    <p className="text-gray-500">{translations.growthEvent2015_1[lang]}</p>
                                </div>
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'skyBlue' }}></div>
                                <div className="flex-1 pl-8">
                                    <p style={{ color: '#333333' }}>{translations.growthEvent2015_2[lang]}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1 text-right pr-8">
                                    <h3 className="font-bold text-lg" style={{ color: '#333333' }}>{translations.growthYear2023[lang]}</h3>
                                    <p className="text-gray-500">{translations.growthEvent2023_1[lang]}</p>
                                </div>
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'skyBlue' }}></div>
                                <div className="flex-1 pl-8">
                                    <p style={{ color: '#333333' }}>{translations.growthEvent2023_2[lang]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our New Company */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">{translations.newCompanyTitle[lang]}</h2>
                        <p className="mt-4 text-lg text-gray-500">{translations.newCompanySubtitle[lang]}</p>
                    </div>

                    <SimpleImageSlider
                        images={companyExteriorImages}
                        heightClass="h-[400px]"
                        autoPlayInterval={6000}
                    />

                </div>
            </section>

            {/* <section className="py-16 bg-white relative overflow-hidden" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">{translations.globalVisionTitle[lang]}</h2>
                        <p className="mt-4 text-lg text-gray-500">{translations.globalVisionSubtitle[lang]}</p>
                    </div>
                    <div className="mt-16 relative h-96">
                        <Image src="/placeholder.svg?height=720&width=1280" alt="Global Map" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent"></div>
                        <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900">{translations.globalVisionExpansionTitle[lang]}</h3>
                                <p className="mt-2 text-gray-500">{translations.globalVisionExpansionDesc[lang]}</p>
                                <div className="mt-4">
                                    <Link
                                        href="#"
                                        className="rounded-md inline-flex items-center px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: 'skyBlue' }}
                                    >
                                        {translations.globalVisionLearnMore[lang]}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

        </div >
    )
}