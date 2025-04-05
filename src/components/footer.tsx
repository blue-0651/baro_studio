"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mail, Youtube, Linkedin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
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

  return (
    <footer
      style={{
        backgroundColor: "#FBF8F2",
        padding: "1rem 0",
        zIndex: 150,
        width: "100%",
        minHeight: "80px", // 최소 높이 설정
      }}
    >
      <div
        style={{
          marginRight: "2%",
          marginLeft : "2%",
          padding: isMobile ? "0 1rem" : "0 2rem", // 모바일에서 패딩 줄임
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // 모바일에서는 세로로 배치
          justifyContent: "space-between",
          alignItems: "center",
          gap: isMobile ? "1.5rem" : "0", // 모바일에서 간격 추가
          position: "relative" // 상대 위치 설정
        }}
      >

        {/* 소셜 미디어 아이콘 섹션 - 왼쪽 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            zIndex: 2 // 아이콘에 z-index 설정
          }}
        >

          <Link href="mailto:contact@example.com" aria-label="Email" style={{ textDecoration: 'none' }}>
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                border: "2px solid black",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: 'transparent',
              }}
            >

              <Mail style={{ width: "1.25rem", height: "1.25rem", color: "black" }} strokeWidth={2} />
            </div>
          </Link>


          <Link
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                backgroundColor: "#FF0000",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Youtube style={{ width: "1.25rem", height: "1.25rem", color: "white" }} />
            </div>
          </Link>


          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                backgroundColor: "#0077B5",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Linkedin style={{ width: "1.25rem", height: "1.25rem", color: "white" }} />
            </div>
          </Link>

          <Link
            href="https://blog.naver.com/baro_studio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Naver Blog"
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                backgroundColor: "#03C75A",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ 
                color: "white", 
                fontWeight: "bold", 
                fontSize: "1rem",
                fontFamily: "sans-serif"
              }}>N</span>
            </div>
          </Link>
        </div>

        {/* 주소와 저작권 정보 섹션 - 정중앙 */}
        <div style={{ 
          position: isMobile ? "static" : "absolute", 
          left: isMobile ? "auto" : "50%", 
          top: isMobile ? "auto" : "50%", 
          transform: isMobile ? "none" : "translate(-50%, -50%)",
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          justifyContent: "center",
          width: isMobile ? "100%" : "auto",
          zIndex: 1 // 낮은 z-index로 설정
        }}>
          <div style={{ 
            fontSize: isMobile ? "0.7rem" : "0.8rem", 
            color: "#666666",
            textAlign: "center"
          }}>
            <p style={{ margin: "0.3rem 0" }}>Address: to be announced</p>
            <p style={{ margin: "0.3rem 0" }}>© {new Date().getFullYear()} BARO. All rights reserved.</p>
          </div>
        </div>

        {/* 로고 섹션 - 오른쪽 */}
        <div style={{ 
          display: "flex", 
          justifyContent: isMobile ? "center" : "flex-end",
          alignItems: "center",
          zIndex: 2 // 로고에 z-index 설정
        }}>
          <Link
            href="/"
            style={{
              display: "block",
              textDecoration: "none",
            }}
          >
            <div style={{ 
              position: "relative", 
              width: isMobile ? "100px" : "120px", 
              height: isMobile ? "50px" : "60px" 
            }}>
              <Image
                src="/baro-logo_bk.png"
                alt="Baro Logo"
                fill
                sizes="(max-width: 768px) 100px, 120px"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </Link>
        </div>
      </div>
    </footer>
  );
}