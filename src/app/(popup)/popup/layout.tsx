import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

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
                    backgroundColor: "#FFFBF5",
                    color: "#333333",
                    flexDirection: 'column',
                    minHeight: '100vh'
                }}
            >

                {children}


            </body>
        </html>
    );
}