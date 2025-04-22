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
          top: isMobile ? "30%" : "30%",
          right: isMobile ? "20px" : "30px",
          transform: "translateY(-50%)",
          zIndex: 99,
          width: isMobile ? "100px" : "140px",
          height: isMobile ? "100px" : "140px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
        }}
        aria-label="요청하기"
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(-50%)";
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src="/request.png"
            alt="Request Quote"
            fill
            sizes="(max-width: 768px) 100px, 140px"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </div>
    </Link>
  );
} 