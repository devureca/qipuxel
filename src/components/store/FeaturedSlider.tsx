'use client'

import { useState, useRef } from 'react'
import type { Product, StoreConfig } from '@/types'
import ProductModal from './ProductModal'

interface FeaturedSliderProps {
    products: Product[]
    config: StoreConfig
    darkMode: boolean
    title?: string
    label?: string
    filterTag?: string
}

export default function FeaturedSlider({
    products,
    config,
    darkMode,
    title = 'Destacados',
    label = 'Lo mejor de la tienda',
    filterTag = 'featured',
}: FeaturedSliderProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    const filtered = products.filter(p => p.tags.includes(filterTag as never))

    if (!filtered.length) return null

    function scroll(dir: 'left' | 'right') {
        if (!scrollRef.current) return
        const amount = 340
        scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
    }

    return (
        <section style={{ padding: '80px 0' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>

                {/* Header */}
                <div
                    style={{
                        padding: '0 5%',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        marginBottom: '2.5rem',
                    }}
                >
                    <div>
                        <p
                            style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.75rem',
                                color: '#888',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                marginBottom: '0.5rem',
                            }}
                        >
                            {label}
                        </p>
                        <h2
                            style={{
                                fontFamily: 'var(--font-bebas)',
                                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                                color: darkMode ? '#f1f1f1' : '#111',
                                letterSpacing: '0.03em',
                                lineHeight: 1,
                            }}
                        >
                            {title}
                        </h2>
                    </div>

                    {/* Arrows */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => scroll('left')}
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                background: darkMode ? '#1a1a1a' : '#111',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s, opacity 0.2s',
                                color: '#fff',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 5l-7 7 7 7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                background: darkMode ? '#1a1a1a' : '#111',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s',
                                color: '#fff',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable cards - empieza con padding izquierdo como la referencia */}
                <div
                    ref={scrollRef}
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        overflowX: 'auto',
                        paddingLeft: '5%',
                        paddingRight: '5%',
                        paddingBottom: '1rem',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        cursor: 'grab',
                    }}
                    className="hide-scrollbar"
                >
                    {filtered.map((product) => {
                        const isSold = product.status === 'sold'
                        const isReserved = product.status === 'reserved'
                        const hovered = hoveredId === product.id

                        return (
                            <div
                                key={product.id}
                                onClick={() => !isSold && !isReserved && setSelectedProduct(product)}
                                onMouseEnter={() => setHoveredId(product.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    flexShrink: 0,
                                    width: 320,
                                    cursor: isSold || isReserved ? 'default' : 'pointer',
                                    opacity: isSold ? 0.6 : 1,
                                }}
                            >
                                {/* Image */}
                                <div
                                    style={{
                                        position: 'relative',
                                        borderRadius: 16,
                                        overflow: 'hidden',
                                        aspectRatio: '3/4',
                                        background: darkMode ? '#1a1a1a' : '#f0f0f0',
                                    }}
                                >
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease',
                                            transform: hovered && !isSold ? 'scale(1.05)' : 'scale(1)',
                                        }}
                                    />

                                    {/* Gradient + title overlay - como en la referencia */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)',
                                            transition: 'opacity 0.3s',
                                            opacity: hovered ? 1 : 0.7,
                                        }}
                                    />

                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '1.2rem',
                                            left: '1.2rem',
                                            right: '1.2rem',
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontFamily: 'var(--font-bebas)',
                                                fontSize: '1.6rem',
                                                color: '#fff',
                                                letterSpacing: '0.05em',
                                                lineHeight: 1,
                                                marginBottom: '0.3rem',
                                            }}
                                        >
                                            {product.name}
                                        </h3>
                                        {product.description && (
                                            <p
                                                style={{
                                                    fontFamily: 'var(--font-dm-sans)',
                                                    fontSize: '0.75rem',
                                                    color: 'rgba(255,255,255,0.7)',
                                                    lineHeight: 1.4,
                                                    display: hovered ? 'block' : 'none',
                                                    transition: 'all 0.3s',
                                                }}
                                            >
                                                {product.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Sold/Reserved overlay */}
                                    {(isSold || isReserved) && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'rgba(0,0,0,0.55)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontFamily: 'var(--font-bebas)',
                                                    fontSize: '2.5rem',
                                                    color: '#fff',
                                                    letterSpacing: '0.1em',
                                                }}
                                            >
                                                {isSold ? 'VENDIDO' : 'RESERVADO'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Price below image */}
                                <div style={{ padding: '0.75rem 4px 0' }}>
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-dm-sans)',
                                            fontWeight: 700,
                                            fontSize: '1rem',
                                            color: config.primaryColor,
                                        }}
                                    >
                                        ${product.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <ProductModal
                product={selectedProduct}
                config={config}
                darkMode={darkMode}
                onClose={() => setSelectedProduct(null)}
            />
        </section>
    )
}