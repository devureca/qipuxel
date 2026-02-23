'use client'

import { useState } from 'react'
import type { Product, StoreConfig } from '@/types'

interface ProductCardProps {
    product: Product
    config: StoreConfig
    darkMode: boolean
    onOpen: (product: Product) => void
}

const CONDITION_LABEL: Record<string, string> = {
    sealed: 'Sellado',
    like_new: 'Como nuevo',
    good: 'Buen estado',
    fair: 'Con detalles',
}

const TAG_LABEL: Record<string, string> = {
    offer: 'OFERTA',
    new: 'NUEVO',
    featured: 'DROP',
}

export default function ProductCard({ product, config, darkMode, onOpen }: ProductCardProps) {
    const [hovered, setHovered] = useState(false)
    const isSold = product.status === 'sold'
    const isReserved = product.status === 'reserved'

    const badgeTag = ['offer', 'new', 'featured'].find(t => product.tags.includes(t as never))
    const badge = badgeTag ? TAG_LABEL[badgeTag] : null

    return (
        <div
            onClick={() => !isSold && !isReserved && onOpen(product)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                cursor: isSold || isReserved ? 'default' : 'pointer',
                opacity: isSold ? 0.6 : 1,
                transition: 'all 0.3s ease',
            }}
        >
            {/* Image container */}
            <div
                style={{
                    position: 'relative',
                    borderRadius: 16,
                    overflow: 'hidden',
                    aspectRatio: '3/4',
                    background: darkMode ? '#1a1a1a' : '#f0f0f0',
                    marginBottom: '1rem',
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

                {/* Badge - pill negro como Velora */}
                {badge && !isSold && !isReserved && (
                    <span
                        style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            background: '#111',
                            color: '#fff',
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            padding: '5px 12px',
                            borderRadius: 100,
                        }}
                    >
                        {badge}
                    </span>
                )}

                {/* Sealed badge */}
                {product.condition === 'sealed' && !isSold && !isReserved && (
                    <span
                        style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)',
                            color: '#fff',
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            padding: '5px 10px',
                            borderRadius: 100,
                            border: '1px solid rgba(255,255,255,0.2)',
                        }}
                    >
                        SELLADO
                    </span>
                )}

                {/* Sold overlay */}
                {isSold && (
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
                            VENDIDO
                        </span>
                    </div>
                )}

                {/* Reserved overlay */}
                {isReserved && (
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
                            RESERVADO
                        </span>
                    </div>
                )}
            </div>

            {/* Info - fuera de la imagen como Velora */}
            <div style={{ padding: '0 4px' }}>
                {product.console && (
                    <p
                        style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.72rem',
                            color: '#888',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            marginBottom: '0.3rem',
                        }}
                    >
                        {product.console}
                    </p>
                )}

                <h3
                    style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: darkMode ? '#f1f1f1' : '#111',
                        marginBottom: '0.4rem',
                        lineHeight: 1.3,
                    }}
                >
                    {product.name}
                </h3>

                {product.description && (
                    <p
                        style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.8rem',
                            color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                            marginBottom: '0.6rem',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {product.description}
                    </p>
                )}

                {/* Price row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                    <span
                        style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.75rem',
                            color: '#888',
                            textDecoration: 'line-through',
                        }}
                    >
                    </span>
                </div>
            </div>
        </div>
    )
}