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
    featured: 'DESTACADO',
}

export default function ProductCard({ product, config, darkMode, onOpen }: ProductCardProps) {
    const [hovered, setHovered] = useState(false)
    const isSold = product.status === 'sold'
    const isReserved = product.status === 'reserved'

    // Badge: primero offer, luego new, luego featured
    const badgeTag = ['offer', 'new', 'featured'].find(t => product.tags.includes(t as never))
    const badge = badgeTag ? TAG_LABEL[badgeTag] : null

    return (
        <div
            onClick={() => !isSold && onOpen(product)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="rounded-lg overflow-hidden transition-all duration-300"
            style={{
                background: darkMode ? config.cardBg : '#fff',
                boxShadow: hovered && !isSold
                    ? '0 16px 48px rgba(0,0,0,0.2)'
                    : '0 2px 12px rgba(0,0,0,0.08)',
                transform: hovered && !isSold ? 'translateY(-6px)' : 'translateY(0)',
                opacity: isSold ? 0.6 : 1,
                cursor: isSold ? 'default' : 'pointer',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
            }}
        >
            {/* Image */}
            <div
                className="relative overflow-hidden"
                style={{ aspectRatio: '1', background: darkMode ? '#1a1a1a' : '#f5f5f5' }}
            >
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                    style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
                />

                {/* Badge */}
                {badge && !isSold && !isReserved && (
                    <span
                        className="absolute top-2 left-2 font-sans text-[0.65rem] font-bold tracking-widest uppercase text-white px-2 py-1 rounded"
                        style={{ background: config.primaryColor }}
                    >
                        {badge}
                    </span>
                )}

                {/* Sold overlay */}
                {isSold && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="font-display text-3xl text-white tracking-widest">VENDIDO</span>
                    </div>
                )}

                {/* Reserved overlay */}
                {isReserved && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="font-display text-3xl text-white tracking-widest">RESERVADO</span>
                    </div>
                )}

                {/* Sealed badge */}
                {product.condition === 'sealed' && !isSold && !isReserved && (
                    <span className="absolute top-2 right-2 font-sans text-[0.6rem] font-bold tracking-widest uppercase text-white px-2 py-1 rounded bg-black/60 border border-white/20">
                        SELLADO
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                {product.console && (
                    <p className="font-sans text-[0.7rem] tracking-widest uppercase mb-1" style={{ color: '#888' }}>
                        {product.console}
                    </p>
                )}

                <h3
                    className="font-sans font-semibold text-sm leading-snug mb-3"
                    style={{ color: darkMode ? '#f1f1f1' : '#111' }}
                >
                    {product.name}
                </h3>

                <div className="flex items-center justify-between">
                    <span
                        className="font-display text-xl tracking-wide"
                        style={{ color: config.primaryColor }}
                    >
                        ${product.price.toLocaleString()}
                    </span>

                    <span className="font-sans text-[0.7rem]" style={{ color: '#888' }}>
                        {product.complete ? '✓ Completo' : 'Sin caja'}
                    </span>
                </div>

                <p className="font-sans text-[0.7rem] mt-1" style={{ color: '#666' }}>
                    {CONDITION_LABEL[product.condition]}
                </p>
            </div>
        </div>
    )
}