"use client";


import { useState, } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import Sidebar, { MenuItem } from "./right-sidebar";
import { useLang } from '@/context/LangContext';
import { usePathname } from 'next/navigation';

// interface HeaderProps { 
//   lang: string;
//   setLang: Dispatch<SetStateAction<string>>;
// }
const BaroStudioLogo = () => (

  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 800 400"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0f0f0" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#f0f0f0" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0b3d91" />
        <stop offset="100%" stopColor="#1a5fb4" />
      </linearGradient>
    </defs>

    <rect x="60" y="60" width="680" height="240" rx="20" ry="20" fill="url(#bgGradient)" opacity="0.3" />

    <g transform="translate(130, 200)">
      <text fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="120" fill="url(#textGradient)">
        BARO
      </text>

      <text fontFamily="Montserrat, sans-serif" fontWeight="300" fontSize="60" fill="#333333" x="360" y="0">
        STUDIO
      </text>
    </g>

    <text fontFamily="Open Sans, sans-serif" fontWeight="400" fontSize="24" fill="#555555" x="195" y="250">
      Manufacturing Excellence
    </text>

    <g stroke="#0b3d91" strokeWidth="3" fill="none">
      <path d="M100,150 L150,150 L150,170 L170,170" />
      <path d="M630,150 L680,150 L680,170 L700,170" />
    </g>

    <g transform="translate(140, 140)">
      <rect x="0" y="0" width="20" height="20" fill="#0b3d91" opacity="0.8" />
      <circle cx="520" cy="10" r="10" fill="#0b3d91" opacity="0.8" />
    </g>
  </svg>
);


/** KR,EN 선택시 영문, 한글 하위 Props를 선택할 수 있게함 */
export default function Header() {
  const { lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const isMainPage = pathname === '/';
  const currentPageTextColor = isMainPage ? '#EFEFEF' : '#333333';
  /** 색상정의 (변경 없음) */
  const navLinkHoverColor = "#F68E1E";
  const langButtonHoverColor = "#F68E1E";
  const langButtonInactiveColor = currentPageTextColor;
  const sidebarBgColor = "#EFEFEF";
  const sidebarTextColor = "#333333";

  // handleLangChange 함수는 이제 Context의 setLang을 사용
  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    setMenuOpen(false);
  };

  /** 메뉴데이터 정의 (이제 Context의 lang 사용, 내부 로직 변경 없음) */

  const menuData = {
    company: {
      title: lang === 'kr' ? '회사소개' : 'Company',
      items: [
        {
          name: lang === 'kr' ? '소개' : 'About us',
          href: '/company/about',
          children: [
            {
              name: lang === 'kr' ? '회사 소개' : 'About us',
              href: '/company/about',
            },
            {
              name: lang === 'kr' ? '동영상' : 'Video',
              href: '/company/video'
            },
          ]
        },
        {
          name: lang === 'kr' ? '게시판' : 'Board',
          href: '/company/board'
        },
        {
          name: lang === 'kr' ? '뉴스' : 'News',
          href: '/company/news',
          children: [
            {
              name: lang === 'kr' ? '회사일정' : 'Schedule',
              href: '/company/schedule',
            },
            {
              name: lang === 'kr' ? '이벤트' : 'event',
              href: '/company/event',
            },
            {
              name: lang === 'kr' ? '채용공고' : 'Recruitment',
              href: '/company/recruitment',
            },
          ]
        },
      ] as MenuItem[]
    },
    capabilities: {
      title: lang === 'kr' ? '핵심역량' : 'Capabilities',
      items: [
        {
          name: 'CNC Machining',
          href: '/capabilities/cnc',
          description: 'Tight tolerances and finishing capabilities, manufactured in one day.'
        },
        {
          name: 'Injection Molding',
          href: '/capabilities/injection',
          description: 'Production-grade resin tooling, as fast as possible.'
        },
        {
          name: '3D Printing',
          href: '/capabilities/3d-printing',
          description: 'FDM, SLA, SLS, PolyJet, MJF technologies.'
        },
        {
          name: 'Urethane Casting',
          href: '/capabilities/urethane',
          description: 'Production-quality parts without the tooling investment.'
        },
        {
          name: 'Sheet Metal',
          href: '/capabilities/sheet-metal',
          description: 'Experience the versatility & cost efficiency with flexible application options.'
        },
        {
          name: 'Compression Molding',
          href: '/capabilities/compression',
          description: 'Experience lower tooling costs with high-quality durable parts.'
        },
        {
          name: '+ISO',
          href: '/capabilities/iso',
        },
      ] as MenuItem[]
    },
    request: {
      title: lang === 'kr' ? '견적요청' : 'Request',
      items: [
        { name: lang === 'kr' ? '견적' : 'Quote', href: '/request/quote' },
      ] as MenuItem[]
    }
  };



  return (
    <div>

      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50px",
          width: "232px",
          height: "120px",
          zIndex: 51
        }}
      >
        <Link
          href="/"
          style={{
            color: "inherit",
            textDecoration: "none",
            display: "block",
            width: "100%",
            height: "100%",
          }}
          aria-label="Baro Studio Home"
        >
          <BaroStudioLogo />
        </Link>
      </div>

      {/* 헤더 메인 부분 , position: absolute 유지) */}
      <header
        style={{
          position: "absolute",
          top: 34,
          left: 0,
          width: "100%",
          zIndex: 50,
          backgroundColor: "transparent",
        }}
      >
        <div
          style={{
            maxWidth: "1750px",
            margin: "0 auto",
            padding: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              {/* 언어 변경 버튼 (handleLangChange 사용) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: langButtonInactiveColor,
                }}
              >
                <button
                  style={{
                    color: lang === 'kr' ? navLinkHoverColor : 'inherit',
                    fontWeight: lang === 'kr' ? 'bold' : '500',
                    background: "none", border: "none", cursor: "pointer",
                    transition: "color 0.2s, font-weight 0.2s", padding: 0, fontSize: 'inherit',
                  }}
                  onClick={() => handleLangChange('kr')} // Context의 setLang 호출
                  onMouseOver={(e) => { if (lang !== 'kr') e.currentTarget.style.color = langButtonHoverColor; }}
                  onMouseOut={(e) => { if (lang !== 'kr') e.currentTarget.style.color = 'inherit'; }}
                > KR </button>
                <span>|</span>
                <button
                  style={{
                    color: lang === 'en' ? navLinkHoverColor : 'inherit',
                    fontWeight: lang === 'en' ? 'bold' : '500',
                    background: "none", border: "none", cursor: "pointer",
                    transition: "color 0.2s, font-weight 0.2s", padding: 0, fontSize: 'inherit',
                  }}
                  onClick={() => handleLangChange('en')} // Context의 setLang 호출
                  onMouseOver={(e) => { if (lang !== 'en') e.currentTarget.style.color = langButtonHoverColor; }}
                  onMouseOut={(e) => { if (lang !== 'en') e.currentTarget.style.color = 'inherit'; }}
                > EN </button>
              </div>

              {/* 메뉴 토글 버튼 */}
              <button
                style={{
                  color: currentPageTextColor, background: "none", border: "none", cursor: "pointer",
                  display: 'flex', alignItems: 'center', padding: 0,
                }}
                onClick={() => setMenuOpen(true)}
                aria-label="Toggle menu"
              > <Menu style={{ width: "1.5rem", height: "1.5rem" }} /> </button>
            </div>
          </div>

          {/* 네비게이션 링크 (이제 Context의 lang 사용, 변경 없음) */}
          {!menuOpen && (
            <div style={{ marginTop: "1rem" }}>
              <nav style={{ display: "flex", justifyContent: "flex-end", gap: "4rem" }} >
                {/* ⭐ 각 Link의 기본 color를 currentPageTextColor로 설정 */}
                <Link href="/company/about" style={{ fontWeight: 'bold', color: currentPageTextColor, textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = navLinkHoverColor)} onMouseOut={(e) => (e.currentTarget.style.color = currentPageTextColor)} >
                  {lang === 'kr' ? '회사소개' : 'Company'} </Link>
                <Link href="/capabilities" style={{ fontWeight: 'bold', color: currentPageTextColor, textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = navLinkHoverColor)} onMouseOut={(e) => (e.currentTarget.style.color = currentPageTextColor)} >
                  {lang === 'kr' ? '핵심역량' : 'Capabilities'} </Link>
                <Link href="/request" style={{ fontWeight: 'bold', color: currentPageTextColor, textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = navLinkHoverColor)} onMouseOut={(e) => (e.currentTarget.style.color = currentPageTextColor)} >
                  {lang === 'kr' ? '견적요청' : 'Request'} </Link>
              </nav>
            </div>
          )}
        </div>



        {/* 사이드바 (menuData가 Context lang 반영) */}
        <Sidebar
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          menuData={menuData}
          sidebarBgColor={sidebarBgColor}
          sidebarTextColor={sidebarTextColor}
        />
      </header>
    </div>
  );
}