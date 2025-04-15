import type React from "react";
import { Inter } from "next/font/google";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Providers from "@/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}