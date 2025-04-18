'use client';

// useState 제거, Header/Footer 임포트 제거
import { useLang } from '@/context/LangContext'; // Context 훅 임포트
import FullScreenSlider from "@/components/main/full-screen-slider";
import CardSlider from "@/components/main/card-slider";
import Event from "@/components/main/event";
import { useEffect } from 'react';

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
  { id: 1, title: "CNC Machining", icon: "/card1.png", href: "/capabilities/cnc" },
  { id: 2, title: "Injection Molding", icon: "/card2.png", href: "/capabilities/injection" },

  { id: 3, title: "Metal Stamping", icon: "/card5.png", href: "/capabilities/metal-stamping" },
   { id: 4, title: "Compression Molding", icon: "/card1.png", href: "/capabilities/compression" },
   { id: 5, title: "3D Printing", icon: "/card3.png", href: "/capabilities/3d-printing" },
   { id: 6, title: "Urethane Casting", icon: "/card4.png", href: "/capabilities/urethane" },
  // { id: 3, title: "3D Printing", icon: "/card3.png", href: "/capabilities/3d-printing" },
  // { id: 4, title: "Urethane Casting", icon: "/card4.png", href: "/capabilities/urethane" },
  // { id: 5, title: "Sheet Metal", icon: "/card5.png", href: "/capabilities/sheet-metal" },
  // { id: 6, title: "Compression Molding", icon: "/card1.png", href: "/capabilities/compression" },
];


export default function Home() {
  const { lang } = useLang();

  /* 팝업 열고싶으면 이거 해제하세요
    useEffect(() => {
      const parentWidth = window.innerWidth;
      const parentHeight = window.innerHeight;
  
  
      const popupWidth = Math.round(parentWidth * 0.25);
      const popupHeight = Math.round(parentHeight * 0.70); 
  
      const left = 3250;
      const top = 250;
  
      const features = `width=${popupWidth},height=${popupHeight},left=${left},top=${top}, right=500,resizable=yes,scrollbars=no,status=no,location=no,menubar=no,toolbar=no`;
      const popupWindow = window.open(
        "/popup",
        "채용공고",
        features
      )
  
      if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === "undefined") {
        alert("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.")
      }
  
      return () => {
        popupWindow?.close();
      }
    }, []);
    */
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