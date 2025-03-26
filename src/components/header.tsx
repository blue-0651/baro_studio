"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1rem",
        }}
      >
        {/* Top row: Logo, Language Selector, and Hamburger */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link
              href="/"
              style={{
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "8rem",
                  height: "2.5rem",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "white" }}>로고</span>
              </div>
            </Link>
          </div>

          {/* Language Selector and Hamburger */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            {/* Language Selector */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <button
                style={{
                  color: "white",
                  fontWeight: "500",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#d1d5db")}
                onMouseOut={(e) => (e.currentTarget.style.color = "white")}
              >
                KR
              </button>
              <span style={{ color: "#9ca3af" }}>|</span>
              <button
                style={{
                  color: "#9ca3af",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "white")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#9ca3af")}
              >
                EN
              </button>
            </div>

            {/* Hamburger Menu Button */}
            <button
              style={{
                color: "white",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu style={{ width: "1.5rem", height: "1.5rem" }} />
            </button>
          </div>
        </div>

        {/* Bottom row: Navigation */}
        <div style={{ marginTop: "1rem" }}>
          <nav
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "2rem",
            }}
          >
            <Link
              href="/company"
              style={{
                color: "white",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#d1d5db")}
              onMouseOut={(e) => (e.currentTarget.style.color = "white")}
            >
              Company
            </Link>
            <Link
              href="/capabilities"
              style={{
                color: "white",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#d1d5db")}
              onMouseOut={(e) => (e.currentTarget.style.color = "white")}
            >
              Capabilities
            </Link>
            <Link
              href="/request"
              style={{
                color: "white",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#d1d5db")}
              onMouseOut={(e) => (e.currentTarget.style.color = "white")}
            >
              Request
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

