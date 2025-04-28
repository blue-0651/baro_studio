import type React from "react";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollTopButton from "@/components/scroll-top-button";
import RequestButton from "@/components/request-button";
import { LangProvider } from "@/context/LangContext";
import "./globals.css";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import type { Metadata, Viewport } from "next";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BARO Studio | Prototype & Manufacturing Solutions",
  description: "BARO Studio offers custom prototype manufacturing, injection molding, compression molding, quick turn tooling, and rapid prototyping services. 바로 스튜디오는 프로토타입 제작, 사출 성형, 압축 성형, 신속한 툴링 및 래피드 프로토타이핑 서비스를 제공합니다.",
  keywords: "Proto type, low volume production, Custom Prototype Manufacturing, Rapid Prototyping Materials, injection molding, compression molding, quick turn tooling, rapid prototype, rapid tooling, over molding, 프로토타입, 소량생산, 맞춤형 프로토타입 제조, 신속 프로토타이핑, 사출성형, 압축성형, 퀵턴 툴링, 오버몰딩",
};


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: inter.style.fontFamily,
          backgroundColor: "#FFFBF5",
          color: "#333333",
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <LangProvider>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Header />
            {children}
            <ScrollTopButton />
            <RequestButton />
          </div>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}