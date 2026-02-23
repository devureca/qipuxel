'use client'

import { useState, useEffect } from 'react'
import type { SliderBanner, StoreConfig } from '@/types'

interface HeroSliderProps {
    slides: SliderBanner[]
    config: StoreConfig
}

const DEFAULT_TITLES = ['Nuevos Ingresos', 'Lo Mejor del Stock', 'Colección Retro', 'Imperdibles']

export default function HeroSlider({ slides, config }: HeroSliderProps) {
    const [current, setCurrent] = useState(0)
    const [animating, setAnimating] = useState(false)
    const [progress, setProgress] = useState(0)

    const activeSlides = slides.filter(s => s.active).sort((a, b) => a.order - b.order)

    useEffect(() => {
        if (activeSlides.length <= 1) return
        setProgress(0)
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    goTo((current + 1) % activeSlides.length)
                    return 0
                }
                return p + 2
            })
        }, 100)
        return () => clearInterval(interval)
    }, [current, activeSlides.length])

    function goTo(idx: number) {
        if (animating || idx === current) return
        setAnimating(true)
        setProgress(0)
        setTimeout(() => {
            setCurrent(idx)
            setAnimating(false)
        }, 400)
    }

    if (!activeSlides.length) return null

    return (
        <section
            style={{
                position: 'relative',
                width: '100%',
                minHeight: 'calc(100vh - 166px)',
                borderRadius: '40px',
                overflow: 'hidden',
            }}
        >
            {/* Background images */}
            {activeSlides.map((s, i) => (
                <div
                    key={s.id}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${s.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'opacity 0.6s ease',
                        opacity: i === current && !animating ? 1 : 0,
                    }}
                />
            ))}

            {/* Gradient overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 100%)',
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: 'absolute',
                    bottom: activeSlides.length > 1 ? 90 : 60,
                    left: '6%',
                    right: '6%',
                    transition: 'all 0.5s ease',
                    opacity: animating ? 0 : 1,
                    transform: animating ? 'translateY(16px)' : 'translateY(0)',
                }}
            >
                <h1
                    style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: 'clamp(4rem, 10vw, 9rem)',
                        color: '#fff',
                        lineHeight: 0.88,
                        letterSpacing: '0.02em',
                        marginBottom: '1.2rem',
                        maxWidth: 750,
                    }}
                >
                    {DEFAULT_TITLES[current] ?? config.name}
                </h1>

                <p
                    style={{
                        fontFamily: 'var(--font-dm-sans)',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '1rem',
                        maxWidth: 400,
                        marginBottom: '2rem',
                        lineHeight: 1.6,
                    }}
                >
                    {config.tagline}
                </p>

                <a
                    href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent('Hola! Vi tu catálogo y me gustaría consultar.')}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: '#fff',
                        color: '#111',
                        padding: '13px 26px',
                        borderRadius: 100,
                        textDecoration: 'none',
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        letterSpacing: '0.04em',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                    }}
                >
                    <span
                        style={{
                            width: 28,
                            height: 28,
                            background: '#111',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </span>
                    Ver catálogo
                </a>
            </div>

            {/* Bottom bar - solo números grandes como la referencia */}
            {activeSlides.length > 1 && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        borderTop: '1px solid rgba(255,255,255,0.12)',
                    }}
                >
                    {activeSlides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            style={{
                                flex: 1,
                                padding: '14px 20px',
                                background: 'rgba(0,0,0,0.3)',
                                backdropFilter: 'blur(8px)',
                                border: 'none',
                                borderRight: i < activeSlides.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.3)')}
                        >
                            {/* Barra de progreso */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: 2,
                                    width: i === current ? `${progress}%` : i < current ? '100%' : '0%',
                                    background: i === current ? config.primaryColor : 'rgba(255,255,255,0.35)',
                                    transition: i === current ? 'width 0.1s linear' : 'none',
                                }}
                            />

                            {/* Solo número grande */}
                            <span
                                style={{
                                    fontFamily: 'var(--font-bebas)',
                                    fontSize: '1.6rem',
                                    letterSpacing: '0.05em',
                                    color: i === current ? '#fff' : 'rgba(255,255,255,0.3)',
                                    transition: 'color 0.3s',
                                }}
                            >
                                0{i + 1}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    )
}