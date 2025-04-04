// src/app/page.tsx
'use client'; // Context 사용을 위해 클라이언트 컴포넌트

// useState 제거, Header/Footer 임포트 제거
import { useLang } from '@/context/LangContext'; // Context 훅 임포트
import FullScreenSlider from "@/components/main/full-screen-slider";
import CardSlider from "@/components/main/card-slider";
import Event from "@/components/main/event";

// 슬라이더 및 카드 데이터 정의 (변경 없음)
const slides_kr = [
  { id: 1, title: "최상의 서비스", subtitle: "고객의 성공을 최우선으로 생각합니다", image: "/main1.png" },
  { id: 2, title: "글로벌 IT 솔루션", subtitle: "최고의 기술력으로 비즈니스 성장을 지원합니다", image: "/main2.png" },
  { id: 3, title: "혁신적인 서비스", subtitle: "맞춤형 IT 서비스로 경쟁력을 강화하세요", image: "/main3.png" },
];
const slides_en = [
  { id: 1, title: "Best Service", subtitle: "We prioritize customer success.", image: "/main1.png" },
  { id: 2, title: "Global IT Solution", subtitle: "Supporting business growth with top technology.", image: "/main2.png" },
  { id: 3, title: "Innovative Service", subtitle: "Enhance competitiveness with customized IT services.", image: "/main3.png" },
];
const cards = [
  { id: 1, title: "CNC Machining", icon: "/card1.png" },
  { id: 2, title: "CNC Machining", icon: "/card2.png" },
  { id: 3, title: "CNC Machining", icon: "/card3.png" },
  { id: 4, title: "CNC Machining", icon: "/card4.png" },
  { id: 5, title: "CNC Machining", icon: "/card5.png" },
  { id: 6, title: "CNC Machining", icon: "/card1.png" },
];

export default function Home() {
  const { lang } = useLang();

  const currentSlides = lang === 'kr' ? slides_kr : slides_en;
  const currentCards = cards;

  return (
    <main>
      <FullScreenSlider slides={currentSlides} />
      <CardSlider cards={currentCards} />
      <Event />
    </main>
  );
}