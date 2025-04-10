"use client"

import "primereact/resources/themes/lara-light-blue/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import { useRouter } from "next/navigation"
import { Button } from "primereact/button"

export default function NotFound() {
    const router = useRouter()

    // Container style for the entire page
    const containerStyle = {
        width: "100%",
        textAlign: "center" as const,
        position: "absolute" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
    }

    // Heading styles
    const h1Style = {
        fontSize: "36px",
        fontWeight: "bold",
        margin: "0 0 20px 0",
    }

    const h2Style = {
        fontSize: "24px",
        fontWeight: "bold",
        margin: "0 0 20px 0",
    }

    // Paragraph style
    const pStyle = {
        fontSize: "16px",
        margin: "0 0 30px 0",
        maxWidth: "500px",
        marginLeft: "auto",
        marginRight: "auto",
    }

    // Button container style
    const buttonContainerStyle = {
        marginTop: "20px",
        textAlign: "center" as const,
    }

    // Individual button styles
    const homeButtonStyle = {
        backgroundColor: "#4285F4",
        color: "white",
        margin: "5px",
        padding: "10px 20px",
    }

    const prevButtonStyle = {
        backgroundColor: "white",
        color: "#666",
        border: "1px solid #ccc",
        margin: "5px",
        padding: "10px 20px",
    }

    const searchButtonStyle = {
        backgroundColor: "#6B7280",
        color: "white",
        margin: "5px",
        padding: "10px 20px",
    }

    return (
        <div style={containerStyle}>
            <h1 style={h1Style}>Comming soon</h1>
            <p style={pStyle}>
                The page opening date is approaching!
            </p>

            <div style={buttonContainerStyle}>

                <Button
                    label="Previous Page"
                    icon="pi pi-arrow-left"
                    onClick={() => window.history.back()}
                    style={prevButtonStyle}
                />
            </div>
        </div>
    )
}
