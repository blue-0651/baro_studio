import Link from "next/link"
import { Mail, Youtube, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "#EFEFEF",
        padding: "1.5rem 0",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Social Media Icons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            <Link href="mailto:contact@example.com" aria-label="Email" style={{ textDecoration: "none" }}>
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  backgroundColor: "#d1d5db",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mail style={{ width: "1.25rem", height: "1.25rem", color: "#1f2937" }} />
              </div>
            </Link>
            <Link
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  backgroundColor: "#dc2626",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Youtube style={{ width: "1.25rem", height: "1.25rem", color: "white" }} />
              </div>
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  backgroundColor: "#2563eb",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Linkedin style={{ width: "1.25rem", height: "1.25rem", color: "white" }} />
              </div>
            </Link>
          </div>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ color: "#f97316", fontSize: "1.875rem", fontWeight: "bold" }}>6</span>
                <span style={{ color: "black", fontSize: "1.875rem", fontWeight: "bold" }}>aro</span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#4b5563" }}>In 6 Days Prototype & Delivery</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

