'use client'

import { useState, useEffect } from 'react'
import type { SliderBanner, StoreConfig } from '@/types'

interface HeroSliderProps {
    slides: SliderBanner[]
    config: StoreConfig
}

export default function HeroSlider({ slides, config }: HeroSliderProps) {
    const [current, setCurrent] = useState(0)
    const [animating, setAnimating] = useState(false)

    const activeSlides = slides.filter(s => s.active).sort((a, b) => a.order - b.order)

    useEffect(() => {
        if (activeSlides.length <= 1) return
        const t = setInterval(() => goTo((current + 1) % activeSlides.length), 5000)
        return () => clearInterval(t)
    }, [current, activeSlides.length])

    function goTo(idx: number) {
        if (animating) return
        setAnimating(true)
        setTimeout(() => {
            setCurrent(idx)
            setAnimating(false)
        }, 300)
    }

    // Si no hay slides no renderiza nada
    if (!activeSlides.length) return null

    const slide = activeSlides[current]

    return (
        <section className="relative h-[90vh] min-h-[500px] overflow-hidden">

            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                style={{
                    backgroundImage: `url(${slide.image})`,
                    opacity: animating ? 0 : 1,
                }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/30 to-transparent" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-[8%] max-w-[1280px] mx-auto">
                <div
                    className="transition-all duration-500"
                    style={{
                        opacity: animating ? 0 : 1,
                        transform: animating ? 'translateY(20px)' : 'translateY(0)',
                    }}
                >
                    <p
                        className="font-sans text-xs tracking-[0.2em] uppercase mb-4"
                        style={{ color: config.primaryColor }}
                    >
                        Catálogo de videojuegos
                    </p>

                    <h1 className="font-display text-[clamp(3rem,8vw,7rem)] text-white leading-none tracking-wide mb-6">
                        {config.name}
                    </h1>

                    <p className="font-sans text-white/80 text-lg max-w-md mb-10">
                        {config.tagline}
                    </p>

                    <a
                        href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent('Hola! Vi tu catálogo y me gustaría consultar.')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block font-sans font-bold text-sm tracking-widest uppercase text-white px-9 py-4 rounded transition-all duration-200 hover:-translate-y-1"
                        style={{
                            background: config.primaryColor,
                            boxShadow: `0 4px 24px ${config.primaryColor}55`,
                        }}
                    >
                        Ver catálogo
                    </a>
                </div>
            </div>

            {/* Dots navigation */}
            {activeSlides.length > 1 && (
                <div className="absolute bottom-8 left-[8%] flex gap-2 z-20">
                    {activeSlides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className="h-2 rounded-full border-none cursor-pointer transition-all duration-300"
                            style={{
                                width: i === current ? 28 : 8,
                                background: i === current ? config.primaryColor : 'rgba(255,255,255,0.4)',
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}