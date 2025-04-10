import type React from "react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollTopButton from "@/components/scroll-top-button";
import RequestButton from "@/components/request-button";
import { LangProvider } from "@/context/LangContext";
import "./globals.css";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Website",
  description: "Website description",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
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
        </LangProvider>
        <Footer />
      </body>
    </html>
  );
}