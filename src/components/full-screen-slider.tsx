"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Slide {
  id: number
  title: string
  subtitle: string
  image: string
}

interface FullScreenSliderProps {
  slides: Slide[]

  autoPlayInterval?: number
}

export default function FullScreenSlider({ slides, autoPlayInterval = 5000 }: FullScreenSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 100)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide()
      }, autoPlayInterval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoPlaying, nextSlide, autoPlayInterval])

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#1E3D59",
      }}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transition: "opacity 1s",
            opacity: index === currentSlide ? 1 : 0,
            zIndex: index === currentSlide ? 10 : 0,
          }}
        >
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              priority
              fill
              style={{
                objectFit: "cover",
                filter: "brightness(0.6)",
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              textAlign: "center",
              padding: "0 1rem",
            }}
          >
            <h2
              style={{
                color: "white",
                fontSize: "1.875rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              {slide.title}
            </h2>
            <p
              style={{
                color: "white",
                fontSize: "1.125rem",
                maxWidth: "48rem",
              }}
            >
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          left: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          color: "white",
          padding: "0.5rem",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.3)")}
        aria-label="Previous slide"
      >
        <ChevronLeft style={{ width: "2rem", height: "2rem" }} />
      </button>
      <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          right: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          color: "white",
          padding: "0.5rem",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.3)")}
        aria-label="Next slide"
      >
        <ChevronRight style={{ width: "2rem", height: "2rem" }} />
      </button>

      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          gap: "0.5rem",
        }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: index === currentSlide ? "1.5rem" : "0.75rem",
              height: "0.75rem",
              borderRadius: "9999px",
              backgroundColor: index === currentSlide ? "white" : "rgba(255, 255, 255, 0.5)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              if (index !== currentSlide) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"
              }
            }}
            onMouseOut={(e) => {
              if (index !== currentSlide) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)"
              }
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

