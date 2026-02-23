'use client'

import { useEffect, useRef, useState } from 'react'
import type { Review } from '@/types'

interface ReviewsProps {
    reviews: Review[]
    darkMode: boolean
    primaryColor: string
}

function useInView(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null)
    const [inView, setInView] = useState(false)
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setInView(true) },
            { threshold }
        )
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [threshold])
    return [ref, inView] as const
}

function StarRating({ rating, primaryColor }: { rating: number; primaryColor: string }) {
    return (
        <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ color: s <= rating ? primaryColor : '#ddd', fontSize: 13 }}>★</span>
            ))}
        </div>
    )
}

function ReviewRow({
    review,
    darkMode,
    primaryColor,
    delay,
    isLast,
}: {
    review: Review
    darkMode: boolean
    primaryColor: string
    delay: number
    isLast: boolean
}) {
    const [ref, inView] = useInView()
    const borderColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'

    return (
        <div
            ref={ref}
            className="review-row"
            style={{
                padding: '2rem 0',
                borderBottom: isLast ? 'none' : `1px solid ${borderColor}`,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s ease ${delay}ms`,
            }}
        >
            {/* Avatar + nombre */}
            <div
                className="review-row-header"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem',
                }}
            >
                <div
                    style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        background: primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontFamily: 'var(--font-bebas)',
                        fontSize: '1.3rem',
                        color: '#fff',
                    }}
                >
                    {review.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p
                        style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            color: darkMode ? '#f1f1f1' : '#111',
                            marginBottom: 4,
                        }}
                    >
                        {review.name}
                    </p>
                    <StarRating rating={review.rating} primaryColor={primaryColor} />
                </div>
            </div>

            {/* Reseña */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p
                    style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.95rem',
                        color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                        lineHeight: 1.7,
                    }}
                >
                    "{review.text}"
                </p>
            </div>
        </div>
    )
}

export default function Reviews({ reviews, darkMode, primaryColor }: ReviewsProps) {
    const [titleRef, titleInView] = useInView()
    const borderColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'

    const visibleReviews = reviews.filter(r => r.visible)

    if (!visibleReviews.length) return null

    return (
        <section
            className="section-padding"
            style={{
                padding: '0 5%',
                background: darkMode ? '#0d0d0d' : '#f7f6f3',
            }}
        >
            <style>{`
        .review-row {
          display: block;
        }
        .review-row-header {
          margin-bottom: 1rem;
        }
        @media (min-width: 768px) {
          .review-row {
            display: grid;
            grid-template-columns: 260px 1fr;
            gap: 2rem;
            align-items: center;
          }
          .review-row-header {
            margin-bottom: 0 !important;
          }
        }
      `}</style>

            <div style={{ maxWidth: 1280, margin: '0 auto', paddingTop: 'clamp(48px, 6vw, 80px)', paddingBottom: 'clamp(48px, 6vw, 80px)' }}>

                {/* Title */}
                <div
                    ref={titleRef}
                    style={{
                        marginBottom: '0.5rem',
                        opacity: titleInView ? 1 : 0,
                        transform: titleInView ? 'translateY(0)' : 'translateY(24px)',
                        transition: 'all 0.6s ease',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: 3, height: 18, background: primaryColor, borderRadius: 2 }} />
                        <p
                            style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.75rem',
                                color: '#888',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Testimonios
                        </p>
                    </div>
                    <h2
                        style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontWeight: 700,
                            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                            color: darkMode ? '#f1f1f1' : '#111',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Clientes felices
                    </h2>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: borderColor, margin: '2rem 0 0' }} />

                {/* Reviews list */}
                {visibleReviews.map((review, i) => (
                    <ReviewRow
                        key={review.id}
                        review={review}
                        darkMode={darkMode}
                        primaryColor={primaryColor}
                        delay={i * 80}
                        isLast={i === visibleReviews.length - 1}
                    />
                ))}
            </div>
        </section>
    )
}