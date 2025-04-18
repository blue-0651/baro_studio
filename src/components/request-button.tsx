"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RequestButton() {
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 변경 감지를 위한 useEffect
  useEffect(() => {
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
    <Link href="/quote">
      <div
        style={{
          position: "fixed",
          top: isMobile ? "30%" : "30%", // 화면 상단 30% 지점으로 위치 변경
          right: isMobile ? "20px" : "30px",
          transform: "translateY(-50%)", // 세로 중앙 정렬을 위한 조정
          zIndex: 99,
          width: isMobile ? "40px" : "50px",
          height: isMobile ? "40px" : "50px",
          borderRadius: "50%",
          backgroundColor: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
          opacity: 0.9,
        }}
        aria-label="요청하기"
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"; // transform 속성 수정
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(-50%)"; // transform 속성 수정
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src="/request.png"
            alt="Request Quote"
            fill
            sizes="(max-width: 768px) 40px, 50px"
            style={{ objectFit: "contain", padding: "5px" }}
            priority
          />
        </div>
      </div>
    </Link>
  );
} 