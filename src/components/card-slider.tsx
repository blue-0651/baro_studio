"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Card {
  id: number
  title: string
  icon: string
}

interface CardSliderProps {
  cards: Card[]
  autoPlayInterval?: number
}

export default function CardSlider({ cards, autoPlayInterval = 5000 }: CardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Calculate how many cards to show based on viewport width
  const [cardsToShow, setCardsToShow] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1)
      } else if (window.innerWidth < 768) {
        setCardsToShow(2)
      } else if (window.innerWidth < 1024) {
        setCardsToShow(3)
      } else {
        setCardsToShow(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const totalSlides = Math.max(1, cards.length - cardsToShow + 1)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }, [totalSlides])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }, [totalSlides])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    // Reset autoplay timer when manually changing slides
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 100)
  }

  // Auto play functionality
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
        padding: "3rem 0",
        overflow: "hidden",
        backgroundColor: "#1E3D59",
      }}
    >
      <div style={{ width: "100%", padding: "0 1rem" }}>
        <div style={{ position: "relative" }}>
          {/* Cards Container */}
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                transition: "transform 0.5s ease-in-out",
                transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
              }}
            >
              {cards.map((card) => (
                <div
                  key={card.id}
                  style={{
                    flexShrink: 0,
                    padding: "0 0.5rem",
                    width: `${100 / cardsToShow}%`,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#EFEFEF",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      height: "16rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {/* Circle Icon */}
                    <div
                      style={{
                        backgroundColor: "white",
                        borderRadius: "9999px",
                        width: "5rem",
                        height: "5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <Image src={card.icon || "/placeholder.svg"} alt={card.title} width={40} height={40} />
                    </div>
                    <h3
                      style={{
                        color: "#1f2937",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                      }}
                    >
                      {card.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Styled like the full-screen slider */}
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

          {/* Navigation Dots */}
          <div
            style={{
              position: "absolute",
              bottom: "-2rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              display: "flex",
              gap: "0.5rem",
            }}
          >
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: index === currentIndex ? "1.5rem" : "0.75rem",
                  height: "0.75rem",
                  borderRadius: "9999px",
                  backgroundColor: index === currentIndex ? "white" : "rgba(255, 255, 255, 0.5)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"
                  }
                }}
                onMouseOut={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)"
                  }
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

