'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product, StoreConfig } from '@/types'

interface ProductModalProps {
    product: Product | null
    config: StoreConfig
    darkMode: boolean
    onClose: () => void
}

const CONDITION_LABEL: Record<string, string> = {
    sealed: 'Sellado',
    like_new: 'Como nuevo',
    good: 'Buen estado',
    fair: 'Con detalles',
}

export default function ProductModal({ product, config, darkMode, onClose }: ProductModalProps) {
    const [currentImage, setCurrentImage] = useState(0)

    // Reset image index cuando cambia el producto
    useEffect(() => {
        setCurrentImage(0)
    }, [product])

    // Cerrar con Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (product) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [product])

    if (!product) return null

    const waMessage = `Hola! Me interesa este producto:\n\n*${product.name}*\nPrecio: $${product.price.toLocaleString()}\n\n${window.location.href}`

    return (
        <div
            className="fixed inset-0 z-200 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl"
                style={{ background: darkMode ? '#141414' : '#fff' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full transition-colors duration-200"
                    style={{ background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
                >
                    <X size={16} className={darkMode ? 'text-white' : 'text-black'} />
                </button>

                <div className="grid md:grid-cols-2">
                    {/* Images */}
                    <div className="relative bg-black/10" style={{ aspectRatio: '1' }}>
                        <img
                            src={product.images[currentImage]}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-tl-xl rounded-bl-xl"
                        />

                        {/* Image navigation */}
                        {product.images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentImage(i => Math.max(0, i - 1))}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white disabled:opacity-30"
                                    disabled={currentImage === 0}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={() => setCurrentImage(i => Math.min(product.images.length - 1, i + 1))}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white disabled:opacity-30"
                                    disabled={currentImage === product.images.length - 1}
                                >
                                    <ChevronRight size={18} />
                                </button>

                                {/* Dots */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                                    {product.images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentImage(i)}
                                            className="w-2 h-2 rounded-full border-none cursor-pointer transition-all duration-200"
                                            style={{ background: i === currentImage ? config.primaryColor : 'rgba(255,255,255,0.5)' }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Info */}
                    <div className="p-6 flex flex-col justify-between">
                        <div>
                            {product.console && (
                                <p className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: '#888' }}>
                                    {product.console}
                                </p>
                            )}

                            <h2
                                className="font-display text-3xl tracking-wide mb-4 leading-none"
                                style={{ color: darkMode ? '#f1f1f1' : '#111' }}
                            >
                                {product.name}
                            </h2>

                            <p
                                className="font-display text-4xl mb-6"
                                style={{ color: config.primaryColor }}
                            >
                                ${product.price.toLocaleString()}
                            </p>

                            {/* Details */}
                            <div className="space-y-2 mb-6">
                                <DetailRow
                                    label="Estado"
                                    value={CONDITION_LABEL[product.condition]}
                                    darkMode={darkMode}
                                />
                                <DetailRow
                                    label="Completo"
                                    value={product.complete ? 'Sí, completo' : 'Sin caja/manual'}
                                    darkMode={darkMode}
                                />
                                {product.region && (
                                    <DetailRow label="Región" value={product.region} darkMode={darkMode} />
                                )}
                            </div>

                            {product.description && (
                                <p
                                    className="font-sans text-sm leading-relaxed mb-6"
                                    style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}
                                >
                                    {product.description}
                                </p>
                            )}
                        </div>

                        {/* CTA */}
                        <a
                            href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(waMessage)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-center font-sans font-bold text-sm tracking-widest uppercase text-white py-4 rounded transition-all duration-200 hover:-translate-y-1"
                            style={{
                                background: config.primaryColor,
                                boxShadow: `0 4px 24px ${config.primaryColor}55`,
                            }}
                        >
                            Contactar por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DetailRow({ label, value, darkMode }: { label: string; value: string; darkMode: boolean }) {
    return (
        <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <span className="font-sans text-xs tracking-widest uppercase" style={{ color: '#888' }}>
                {label}
            </span>
            <span className="font-sans text-sm font-medium" style={{ color: darkMode ? '#f1f1f1' : '#111' }}>
                {value}
            </span>
        </div>
    )
}