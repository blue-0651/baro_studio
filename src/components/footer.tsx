import Link from "next/link";

import { Mail, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#D1D5DB",
        padding: "1rem 0",
        //marginTop: "8rem",
        zIndex: 150,
      }}
    >
      <div
        style={{
          marginRight: "2%",
          marginLeft : "2%",
          padding: "0 2rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >

          <Link href="mailto:contact@example.com" aria-label="Email" style={{ textDecoration: 'none' }}>
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
                backgroundColor: "#FF0000",
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
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                backgroundColor: "#0077B5",
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

        <div>
          <Link
            href="/"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textDecoration: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", lineHeight: 1 }}>
              <span style={{ color: "#F97316", fontSize: "2.5rem", fontWeight: "bold" }}>6</span>
              <span style={{ color: "black", fontSize: "2.5rem", fontWeight: "bold" }}>aro</span>
            </div>


            <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: "0.8rem", color: "#333333", fontWeight: '500' }}>In</span>

              <span style={{
                display: 'inline-block',
                width: '1.5em',
                height: '0.2em',
                backgroundColor: '#F97316',
                verticalAlign: 'middle',
                marginBottom: '0.1em'
              }}></span>
              <span style={{ fontSize: "0.8rem", color: "#333333", fontWeight: '500' }}>Days Prototype & Delivery</span>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  );
}