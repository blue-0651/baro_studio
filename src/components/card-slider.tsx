"use client"

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react"
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
  const [cardsToShow, setCardsToShow] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      let newCardsToShow = 4; // Default
      if (window.innerWidth < 640) {
        newCardsToShow = 1;
      } else if (window.innerWidth < 768) {
        newCardsToShow = 2;
      } else if (window.innerWidth < 1024) {
        newCardsToShow = 3;
      }

      if (newCardsToShow !== cardsToShow) {
        setCardsToShow(newCardsToShow);
        setCurrentIndex(0);
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [cardsToShow]);

  const totalSlides = cards.length > 0 ? Math.max(1, cards.length - cardsToShow + 1) : 1;

  useEffect(() => {
    if (currentIndex >= totalSlides) {
      setCurrentIndex(Math.max(0, totalSlides - 1));
    }
  }, [currentIndex, totalSlides]);

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index)
      setIsAutoPlaying(false)

      setTimeout(() => setIsAutoPlaying(true), autoPlayInterval * 1.5);
    }
  }


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAutoPlaying && totalSlides > 1) {
      interval = setInterval(nextSlide, autoPlayInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, nextSlide, autoPlayInterval, totalSlides]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div
      style={{

        width: "100%",
        padding: "3rem 0",
        backgroundColor: "#1E3D59",
        height: '43vh',
        marginTop: "8rem",
        marginBottom: "8rem",
        boxSizing: "border-box",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      <div style={{ position: "relative", height: "100%" }}>


        <div style={{
          overflow: "hidden",
          height: "100%",
          margin: "0 1rem"
        }}
        >
          <div
            style={{
              display: "flex",
              height: "100%",
              transition: "transform 0.5s ease-in-out",
              transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                style={{
                  flexShrink: 0,
                  width: `${100 / cardsToShow}%`,
                  padding: "0 0.5rem",
                  boxSizing: "border-box",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    backgroundImage: `url(${card.icon || "/placeholder.svg"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "inherit",
                    }}
                  />

                  <h3
                    style={{
                      color: "white",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: "0 1rem",
                      zIndex: 10,
                      position: "relative",
                      textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {card.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              style={{
                position: "absolute",
                left: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 20,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "white",
                padding: "0.5rem",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.3)")}
              aria-label="Previous slide"
            >
              <ChevronLeft style={{ width: "2rem", height: "2rem", display: 'block' }} />
            </button>
            <button
              onClick={nextSlide}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 20,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "white",
                padding: "0.5rem",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.3)")}
              aria-label="Next slide"
            >
              <ChevronRight style={{ width: "2rem", height: "2rem", display: 'block' }} />
            </button>
          </>
        )}

        {totalSlides > 1 && (
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
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => { if (index !== currentIndex) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; }}
                onMouseOut={(e) => { if (index !== currentIndex) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)"; }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}