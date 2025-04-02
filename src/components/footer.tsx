"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mail, Youtube, Linkedin } from "lucide-react";

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
          alignItems: isMobile ? "center" : "center",
          gap: isMobile ? "1.5rem" : "0", // 모바일에서 간격 추가
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
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
        </div>

        <div>
          <Link
            href="/"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-end", // 모바일에서는 중앙 정렬
              textDecoration: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", lineHeight: 1 }}>
              <span style={{ 
                color: "#F97316", 
                fontSize: isMobile ? "2rem" : "2.5rem", 
                fontWeight: "bold" 
              }}>6</span>
              <span style={{ 
                color: "black", 
                fontSize: isMobile ? "2rem" : "2.5rem", 
                fontWeight: "bold" 
              }}>aro</span>
            </div>


            <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ 
                fontSize: isMobile ? "0.7rem" : "0.8rem", 
                color: "#333333", 
                fontWeight: '500' 
              }}>In</span>

              <span style={{
                display: 'inline-block',
                width: '1.5em',
                height: '0.2em',
                backgroundColor: '#F97316',
                verticalAlign: 'middle',
                marginBottom: '0.1em'
              }}></span>
              <span style={{ 
                fontSize: isMobile ? "0.7rem" : "0.8rem", 
                color: "#333333", 
                fontWeight: '500' 
              }}>Days Prototype & Delivery</span>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  );
}