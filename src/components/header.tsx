"use client";


import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// import { Menu } from "lucide-react"; // Menu 아이콘 제거
import Sidebar, { MenuItem } from "./main/right-sidebar";
import { useLang } from '@/context/LangContext';
import { usePathname } from 'next/navigation';
import { X } from "lucide-react";

// interface HeaderProps { 
//   lang: string;
//   setLang: Dispatch<SetStateAction<string>>;
// }

// 로고 부분을 단순 요소로 대체
export default function Header() {
  const { lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const isMainPage = pathname === '/';
  const currentPageTextColor = '#333333';
  /** 색상정의 (변경 없음) */
  const navLinkHoverColor = "#F68E1E";
  const langButtonHoverColor = "#F68E1E";
  const langButtonInactiveColor = currentPageTextColor;
  const sidebarBgColor = "rgba(255, 255, 255, 0.05)"; // 투명도를 더 높임 (0.45 -> 0.25)
  const sidebarTextColor = "#333333";

  // 로고 이미지 결정 - 메인 페이지가 아닌 경우 검은색 로고 사용
  const logoImage = pathname === '/' ? '/w_logo.png' : '/baro-logo_bk.png';

  // 모바일 화면 여부 확인을 위한 상태 추가
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 변경 감지를 위한 useEffect 추가
  useEffect(() => {
    // 초기 로드 시 화면 크기 확인
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 초기 실행
    checkMobile();

    // 화면 크기 변경 시 이벤트 리스너
    window.addEventListener('resize', checkMobile);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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
          name: 'Metal Stamping',
          href: '/capabilities/metal-stamping',
          description: 'High-quality metal stamping solutions for your manufacturing needs.'
        },
        {
          name: 'Compression Molding',
          href: '/capabilities/compression',
          description: 'Experience lower tooling costs with high-quality durable parts.'
        },
        {
          name: '3D Pringting',
          href: '/capabilities/3d-printing',
          description: 'FDM, SLA, SLS, PolyJet, MJF technologies.'
        },
        {
          name: 'Urethane Casting',
          href: '/capabilities/urethane',
          description: 'Production-quality parts without the tooling investment.'
        }
      ] as MenuItem[]
    },
    request: {
      title: lang === 'kr' ? '견적요청' : 'Request',
      items: [
        {
          name: lang === 'kr' ? '견적' : 'Quote',
          href: '/quote'
        }
      ] as MenuItem[]
    }
  };



  return (
    <div>
      {/* 로고 부분을 div로 단순화 */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "8px" : "15px",
          left: isMobile ? "15px" : "30px",
          width: isMobile ? "100px" : "180px",
          height: isMobile ? "50px" : "90px",
          zIndex: 51,
          maxWidth: "95%", // 최대 너비 제한
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
          <div style={{
            width: "100%",
            height: "100%",
            position: "relative"
          }}>
            <Image
              src={logoImage}
              alt="Baro Studio Logo"
              fill
              priority
              sizes="(max-width: 768px) 100px, 180px"
              style={{
                objectFit: "contain",
                objectPosition: "left center"
              }}
            />
          </div>
        </Link>
      </div>

      {/* 헤더 메인 부분도 모바일에 맞게 조정 */}
      <header
        style={{
          position: "absolute",
          top: isMobile ? 15 : 25,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 50,
          backgroundColor: "transparent",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            width: "95%",
            margin: "0 auto",
            padding: isMobile ? "0.5rem" : "1rem",
            paddingRight: isMobile ? "1rem" : "2rem",
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
                gap: isMobile ? "1rem" : "1.5rem",
              }}
            >
              {/* 언어 변경 버튼 (handleLangChange 사용) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: langButtonInactiveColor,
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
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
                <span>|</span>
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
              </div>

              {/* 메뉴 토글 버튼 - menuOpen 상태에 따라 햄버거/X 아이콘 전환 */}
              <button
                style={{
                  color: currentPageTextColor,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: menuOpen ? 'center' : 'space-between',
                  alignItems: 'flex-start',
                  padding: 0,
                  width: isMobile ? "18px" : "24px",
                  height: isMobile ? "16px" : "20px",
                  transition: "transform 0.2s ease",
                  zIndex: 102 // 사이드바보다 높은 z-index로 항상 위에 표시
                }}
                onClick={() => setMenuOpen(!menuOpen)} // 토글 기능
                onMouseOver={(e) => {
                  if (!menuOpen) {
                    // 햄버거 아이콘인 경우
                    const lines = e.currentTarget.querySelectorAll('div');
                    lines.forEach(line => {
                      line.style.backgroundColor = navLinkHoverColor;
                    });
                  } else {
                    // X 아이콘인 경우
                    e.currentTarget.style.color = navLinkHoverColor;
                  }
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  if (!menuOpen) {
                    // 햄버거 아이콘인 경우
                    const lines = e.currentTarget.querySelectorAll('div');
                    lines.forEach(line => {
                      line.style.backgroundColor = currentPageTextColor;
                    });
                  } else {
                    // X 아이콘인 경우
                    e.currentTarget.style.color = currentPageTextColor;
                  }
                  e.currentTarget.style.transform = "scale(1)";
                }}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {!menuOpen ? (
                  // 햄버거 아이콘 (메뉴가 닫혀있을 때)
                  <>
                    <div style={{
                      width: "100%",
                      height: "2px",
                      backgroundColor: currentPageTextColor,
                      borderRadius: "1px",
                      transition: "background-color 0.2s ease",
                    }} />
                    <div style={{
                      width: "60%",
                      height: "2px",
                      backgroundColor: currentPageTextColor,
                      borderRadius: "1px",
                      transition: "background-color 0.2s ease",
                    }} />
                    <div style={{
                      width: "80%",
                      height: "2px",
                      backgroundColor: currentPageTextColor,
                      borderRadius: "1px",
                      transition: "background-color 0.2s ease",
                    }} />
                  </>
                ) : (
                  // X 아이콘 (메뉴가 열려 있을 때)
                  <X
                    size={isMobile ? 18 : 24}
                    strokeWidth={2.5}
                    color={currentPageTextColor}
                    style={{ transform: "scale(1.15)" }} // 크기를 약간 키워 햄버거 아이콘과 비슷한 시각적 크기로 조정
                  />
                )}
              </button>
            </div>
          </div>

          {/* 네비게이션 링크 (이제 Context의 lang 사용, 변경 없음) */}
          {!menuOpen && (
            <div style={{ marginTop: isMobile ? ".5rem" : "2.1rem", marginRight: isMobile ? ".5rem" : "11.42rem" }}>
              <nav style={{
                display: "flex",
                justifyContent: "flex-end",
                // ⭐ gap 값을 유지하거나 사이드바의 marginBottom과 시각적으로 맞춰 조절
                gap: isMobile ? "1.5rem" : "12.85rem",
                // ⭐ fontSize 값을 사이드바와 동일하게 유지
                fontSize: isMobile ? "13px" : "18px",
                flexWrap: isMobile ? "wrap" : "nowrap",
                paddingBottom: isMobile ? "0.5rem" : "0",
              }} >
                <Link href="/company/about" style={{
                  // ⭐ fontWeight를 사이드바와 동일하게 유지
                  fontWeight: 'bold',
                  color: currentPageTextColor,
                  textDecoration: "none",
                  transition: "color 0.2s",
                  whiteSpace: "nowrap",
                  padding: isMobile ? "3px 0" : "0",
                }} onMouseOver={(e) => (e.currentTarget.style.color = navLinkHoverColor)} onMouseOut={(e) => (e.currentTarget.style.color = currentPageTextColor)} >
                  {lang === 'kr' ? '회사소개' : 'Company'} </Link>
                <Link href="/capabilities" style={{
                  fontWeight: 'bold',
                  color: currentPageTextColor,
                  textDecoration: "none",
                  transition: "color 0.2s",
                  whiteSpace: "nowrap",
                  marginLeft: isMobile ? "0" : "0.63rem",

                  padding: isMobile ? "3px 0" : "0",
                }} onMouseOver={(e) => (e.currentTarget.style.color = navLinkHoverColor)} onMouseOut={(e) => (e.currentTarget.style.color = currentPageTextColor)} >
                  {lang === 'kr' ? '핵심역량' : 'Capabilities'} </Link>
                <Link href="/quote" style={{
                  fontWeight: 'bold',
                  color: currentPageTextColor,
                  textDecoration: "none",
                  transition: "color 0.2s",
                  whiteSpace: "nowrap",
                  marginLeft: isMobile ? "0" : "-0.6rem",
                  padding: isMobile ? "3px 0" : "0",
                }} onMouseOver={(e) => (e.currentTarget.style.color = navLinkHoverColor)} onMouseOut={(e) => (e.currentTarget.style.color = currentPageTextColor)} >
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
          isMobile={isMobile}
        />
      </header>
    </div>
  );
}