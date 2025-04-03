"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SimpleImageSliderProps {
    images: string[]
    heightClass?: string
    autoPlayInterval?: number
}

export default function SimpleImageSlider({
    images,
    heightClass = "h-[400px]",
    autoPlayInterval = 5000
}: SimpleImageSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [isHovering, setIsHovering] = useState(false)

    const nextSlide = useCallback(() => {
        if (images.length > 1) {
            setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
        }
    }, [images.length])

    const prevSlide = useCallback(() => {
        if (images.length > 1) {
            setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1))
        }
    }, [images.length])

    const goToSlide = (index: number) => {
        if (images.length > 1) {
            setCurrentSlide(index)
            setIsAutoPlaying(false)
            setTimeout(() => setIsAutoPlaying(true), autoPlayInterval + 500)
        }
    }

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isAutoPlaying && !isHovering && images.length > 1) {
            interval = setInterval(nextSlide, autoPlayInterval)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isAutoPlaying, isHovering, nextSlide, autoPlayInterval, images.length])

    if (!images || images.length === 0) {
        return <div className={`relative w-full ${heightClass} bg-gray-200 flex items-center justify-center rounded-lg shadow-md`}>No image available.</div>;
    }

    if (images.length === 1) {
        return (
            <div className={`relative w-full ${heightClass} overflow-hidden rounded-lg shadow-md`}>
                <Image
                    src={images[0]}
                    alt={`Image 1`}
                    fill
                    priority // Load the single image eagerly
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
            </div>
        );
    }

    return (
        <div
            className={`relative w-full ${heightClass} overflow-hidden rounded-lg shadow-md`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Slides Container */}
            {images.map((src, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <Image
                        src={src}
                        alt={`Slide ${index + 1}`}
                        fill
                        priority={index === 0}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    />
                </div>
            ))}

            <>
                <button
                    onClick={prevSlide}
                    className="absolute left-2 sm:left-3 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous slide"
                    disabled={images.length <= 1}
                >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 sm:right-3 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next slide"
                    disabled={images.length <= 1}
                >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                <div className="absolute bottom-3 sm:bottom-4 left-1/2 z-20 flex -translate-x-1/2 transform space-x-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-white/80 focus:ring-offset-1 focus:ring-offset-black/50 ${index === currentSlide ? "w-4 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </>
        </div>
    )
}