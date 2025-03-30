import type React from "react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { LangProvider } from "@/context/LangContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Website",
  description: "Website description",
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
          backgroundColor: "#1E3D59",
          color: "white",
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <LangProvider>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Header />
            {children}
          </div>
        </LangProvider>
        <Footer />
      </body>
    </html>
  );
}