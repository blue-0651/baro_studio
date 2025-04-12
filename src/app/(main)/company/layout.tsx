import { LangProvider } from "@/context/LangContext";
import Providers from "@/Providers";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return <Providers>{children}</Providers>;
}