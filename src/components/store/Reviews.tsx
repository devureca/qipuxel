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
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(s => (
                <span
                    key={s}
                    className="text-sm"
                    style={{ color: s <= rating ? primaryColor : '#333' }}
                >
                    ★
                </span>
            ))}
        </div>
    )
}

function ReviewCard({
    review,
    darkMode,
    primaryColor,
    delay,
}: {
    review: Review
    darkMode: boolean
    primaryColor: string
    delay: number
}) {
    const [ref, inView] = useInView()

    return (
        <div
            ref={ref}
            className="p-6 rounded-xl transition-all duration-700"
            style={{
                background: darkMode ? '#1a1a1a' : '#f9f9f9',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: `${delay}ms`,
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                {/* Avatar */}
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg text-white shrink-0"
                    style={{ background: primaryColor }}
                >
                    {review.name.charAt(0).toUpperCase()}
                </div>

                <div>
                    <p
                        className="font-sans font-semibold text-sm"
                        style={{ color: darkMode ? '#f1f1f1' : '#111' }}
                    >
                        {review.name}
                    </p>
                    <p className="font-sans text-xs" style={{ color: '#888' }}>
                        {review.date ? new Date(review.date ?? '').toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }) : ''}
                    </p>
                </div>

                <div className="ml-auto">
                    <StarRating rating={review.rating} primaryColor={primaryColor} />
                </div>
            </div>

            {/* Text */}
            <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: darkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)' }}
            >
                {review.text}
            </p>
        </div>
    )
}

export default function Reviews({ reviews, darkMode, primaryColor }: ReviewsProps) {
    const [titleRef, titleInView] = useInView()

    const visibleReviews = reviews.filter(r => r.visible)

    // Si no hay reseñas visibles no renderiza nada
    if (!visibleReviews.length) return null

    return (
        <section
            className="py-24 px-[5%]"
            style={{ background: darkMode ? '#0d0d0d' : '#f5f5f5' }}
        >
            <div className="max-w-[1280px] mx-auto">

                {/* Title */}
                <div
                    ref={titleRef}
                    className="mb-12 transition-all duration-600"
                    style={{
                        opacity: titleInView ? 1 : 0,
                        transform: titleInView ? 'translateY(0)' : 'translateY(24px)',
                    }}
                >
                    <p className="font-sans text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#888' }}>
                        Lo que dicen
                    </p>
                    <h2
                        className="font-display text-5xl tracking-wide"
                        style={{ color: darkMode ? '#f1f1f1' : '#111' }}
                    >
                        Clientes felices
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleReviews.map((review, i) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            darkMode={darkMode}
                            primaryColor={primaryColor}
                            delay={i * 100}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}