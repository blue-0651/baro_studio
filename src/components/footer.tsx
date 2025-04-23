"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useLang } from "@/context/LangContext";

type Language = 'kr' | 'en';

const footerTranslations = {
  address: {
    kr: "주소 : 경기도 화성시 향남읍 토성로 310-30 우편번호 18589",
    en: "Address : 310-30, Toseong-ro, Hyangnam-eup, Hwaseong-si, Gyeongi-do, S.Korea 18589"
  },
  email: {
    kr: "이메일 : info@baro-studio.com",
    en: "Email : info@baro-studio.com"
  },
  copyright: {
    kr: `© ${new Date().getFullYear()} BARO. All rights reserved.`,
    en: `© ${new Date().getFullYear()} BARO. All rights reserved.`
  }
};


export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  const { lang } = useLang() as { lang: Language };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const currentLang = lang || 'kr';

  return (
    <footer
      style={{
        backgroundColor: "#FBF8F2",
        padding: "1rem 0",
        zIndex: 150,
        width: "100%",
        minHeight: "80px",
      }}
    >
      <div
        style={{
          marginRight: "2%",
          marginLeft: "2%",
          padding: isMobile ? "0 1rem" : "0 2rem",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: isMobile ? "1.5rem" : "0",
          position: "relative"
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            zIndex: 2
          }}
        >
          <Link href="mailto:info@baro-studio.com" aria-label="Email" style={{ textDecoration: 'none' }}>
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
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ position: "relative", width: "2.5rem", height: "2.5rem" }}>
                <Image
                  src="/image_youtube.png"
                  alt="YouTube"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
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
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ position: "relative", width: "2.5rem", height: "2.5rem" }}>
                <Image
                  src="/image_linkedin.png"
                  alt="LinkedIn"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
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
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ position: "relative", width: "2.5rem", height: "2.5rem" }}>
                <Image
                  src="/image_naver.png"
                  alt="Naver Blog"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </div>
          </Link>
        </div>

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
          zIndex: 1
        }}>
          <div style={{
            fontSize: isMobile ? "0.7rem" : "0.8rem",
            color: "#666666",
            textAlign: "center"
          }}>
            <p style={{ margin: "0.3rem 0" }}>
              {footerTranslations.address[currentLang]}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              {footerTranslations.email[currentLang]}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              {footerTranslations.copyright[currentLang]}
            </p>
          </div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: isMobile ? "center" : "flex-end",
          alignItems: "center",
          zIndex: 2
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