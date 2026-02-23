'use client'

import { useEffect, useRef, useState } from 'react'

interface Brand {
    id: string
    name: string
    logo: string | null
}

interface BrandsBannerProps {
    brands: Brand[]
    darkMode: boolean
}

export default function BrandsBanner({ brands, darkMode }: BrandsBannerProps) {
    const [titleInView, setTitleInView] = useState(false)
    const titleRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setTitleInView(true) },
            { threshold: 0.1 }
        )
        if (titleRef.current) obs.observe(titleRef.current)
        return () => obs.disconnect()
    }, [])

    // Aquí abajo del useEffect, no antes
    if (!brands.length) return null

    const bg = darkMode ? '#111' : '#E8E8E8'
    const textColor = darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
    const tripled = [...brands, ...brands, ...brands]
    const duration = brands.length * 4

    return (
        <section style={{ background: bg, padding: '48px 0', overflow: 'hidden' }}>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .brands-track {
          animation: marquee ${duration}s linear infinite;
          will-change: transform;
        }
        .brands-track:hover {
          animation-play-state: paused;
        }
      `}</style>

            {/* Title */}
            <div
                ref={titleRef}
                style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    opacity: titleInView ? 1 : 0,
                    transform: titleInView ? 'translateY(0)' : 'translateY(16px)',
                    transition: 'all 0.6s ease',
                }}
            >
                <p style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#888',
                }}>
                    Marcas con las que trabajamos
                </p>
            </div>

            {/* Marquee */}
            <div style={{ overflow: 'hidden', width: '100%' }}>
                <div
                    className="brands-track"
                    style={{
                        display: 'flex',
                        gap: '4rem',
                        width: 'max-content',
                    }}
                >
                    {tripled.map((brand, i) => (
                        <div
                            key={`${brand.id}-${i}`}
                            style={{
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 1rem',
                            }}
                        >
                            {brand.logo ? (
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    style={{
                                        height: 30,
                                        objectFit: 'contain',
                                        filter: darkMode
                                            ? 'brightness(0) invert(1) opacity(0.4)'
                                            : 'opacity(0.4)',
                                    }}
                                />
                            ) : (
                                <span style={{
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    letterSpacing: '0.02em',
                                    color: textColor,
                                    whiteSpace: 'nowrap',
                                }}>
                                    {brand.name}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}