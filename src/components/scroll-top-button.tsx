"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

// 애니메이션 키프레임 스타일 문자열 정의
const animationStyles = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-3px); }
  }
`;

export default function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 스크롤 위치에 따라 버튼 표시 여부 설정 및 화면 크기 감지
  useEffect(() => {
    // 스타일 추가
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = animationStyles;
    document.head.appendChild(styleElement);

    const toggleVisibility = () => {
      // 스크롤이 300px 이상 내려갔을 때 버튼 표시
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 초기 실행
    toggleVisibility();
    checkMobile();

    // 이벤트 리스너 등록
    window.addEventListener("scroll", toggleVisibility);
    window.addEventListener("resize", checkMobile);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거 및 스타일 제거
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("resize", checkMobile);
      document.head.removeChild(styleElement);
    };
  }, []);

  // 버튼 애니메이션 효과
  useEffect(() => {
    let animationInterval: NodeJS.Timeout;
    
    if (isAnimating) {
      let count = 0;
      animationInterval = setInterval(() => {
        count++;
        if (count >= 3) { // 1.5초 후 애니메이션 중지(더 빠르게)
          setIsAnimating(false);
          clearInterval(animationInterval);
        }
      }, 500);
    }
    
    return () => {
      if (animationInterval) clearInterval(animationInterval);
    };
  }, [isAnimating]);

  // 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    setIsAnimating(true); // 애니메이션 시작
    
    // 현재 스크롤 위치
    const startPosition = window.pageYOffset;
    // 스크롤 속도 조절 (값이 클수록 빠름)
    const speed = 50;
    // 스크롤 간격 시간 (ms, 값이 작을수록 빠름)
    const interval = 10;
    
    // 더 빠른 스크롤을 위한 직접 구현
    let position = startPosition;
    const timer = setInterval(() => {
      // 현재 위치에서 speed만큼 뺌
      position = position - speed;
      if (position <= 0) {
        // 스크롤이 맨 위에 도달하면 타이머 종료
        window.scrollTo(0, 0);
        clearInterval(timer);
      } else {
        // 아니면 해당 위치로 스크롤
        window.scrollTo(0, position);
      }
    }, interval);
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: isMobile ? "20px" : "30px",
            right: isMobile ? "20px" : "30px",
            zIndex: 99,
            width: isMobile ? "40px" : "50px",
            height: isMobile ? "40px" : "50px",
            borderRadius: "50%",
            backgroundColor: "#F68E1E", // 오렌지 색상
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
            opacity: 0.9, // 약간 투명하게
            animation: isAnimating ? "pulse 0.7s infinite" : "none",
          }}
          aria-label="맨 위로 스크롤"
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#e67e0d";
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.opacity = "1";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#F68E1E";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.opacity = "0.9";
          }}
        >
          <ArrowUp 
            size={isMobile ? 20 : 24} 
            strokeWidth={2.5} 
            style={{
              animation: isAnimating ? "bounce 0.3s ease infinite alternate" : "none"
            }}
          />
        </button>
      )}
    </>
  );
} 