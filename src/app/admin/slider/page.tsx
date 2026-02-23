'use client'

import { useState } from 'react'
import type { SliderBanner } from '@/types'
import { mockSliders } from '@/lib/mockData'

export default function SliderPage() {
    const [slides, setSlides] = useState<SliderBanner[]>(mockSliders)

    function toggleActive(id: string) {
        setSlides(prev =>
            prev.map(s => s.id === id ? { ...s, active: !s.active } : s)
        )
    }

    function moveUp(index: number) {
        if (index === 0) return
        const updated = [...slides]
            ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
        setSlides(updated.map((s, i) => ({ ...s, order: i + 1 })))
    }

    function moveDown(index: number) {
        if (index === slides.length - 1) return
        const updated = [...slides]
            ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
        setSlides(updated.map((s, i) => ({ ...s, order: i + 1 })))
    }

    function deleteSlide(id: string) {
        setSlides(prev => prev.filter(s => s.id !== id))
    }

    return (
        <div style={{ maxWidth: 720 }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
            }}>
                <div>
                    <h1 style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: '2rem',
                        color: '#fff',
                        letterSpacing: '0.05em',
                    }}>
                        SLIDER
                    </h1>
                    <p style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.4)',
                    }}>
                        {slides.filter(s => s.active).length} slides activos de {slides.length}
                    </p>
                </div>
                <button
                    style={{
                        background: '#fff',
                        color: '#111',
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 20px',
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                    }}
                >
                    + Agregar slide
                </button>
            </div>

            {/* Slides list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {slides
                    .sort((a, b) => a.order - b.order)
                    .map((slide, i) => (
                        <div
                            key={slide.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '80px 1fr auto',
                                gap: '1rem',
                                alignItems: 'center',
                                background: '#111',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 12,
                                padding: '1rem',
                                opacity: slide.active ? 1 : 0.5,
                                transition: 'opacity 0.2s',
                            }}
                        >
                            {/* Preview imagen */}
                            <div style={{
                                width: 80,
                                height: 56,
                                borderRadius: 8,
                                overflow: 'hidden',
                                background: '#1a1a1a',
                                flexShrink: 0,
                            }}>
                                <img
                                    src={slide.image}
                                    alt={`Slide ${i + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Info */}
                            <div>
                                <p style={{
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: '#fff',
                                    marginBottom: 4,
                                }}>
                                    Slide {slide.order}
                                </p>
                                <p style={{
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.75rem',
                                    color: 'rgba(255,255,255,0.3)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {slide.image}
                                </p>
                            </div>

                            {/* Acciones */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {/* Mover arriba/abajo */}
                                <button
                                    onClick={() => moveUp(i)}
                                    disabled={i === 0}
                                    style={arrowBtnStyle(i === 0)}
                                >
                                    ↑
                                </button>
                                <button
                                    onClick={() => moveDown(i)}
                                    disabled={i === slides.length - 1}
                                    style={arrowBtnStyle(i === slides.length - 1)}
                                >
                                    ↓
                                </button>

                                {/* Toggle activo */}
                                <button
                                    onClick={() => toggleActive(slide.id)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: 6,
                                        border: `1px solid ${slide.active ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                        background: slide.active ? 'rgba(74,222,128,0.1)' : 'transparent',
                                        color: slide.active ? '#4ade80' : 'rgba(255,255,255,0.3)',
                                        fontFamily: 'var(--font-dm-sans)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {slide.active ? 'Activo' : 'Inactivo'}
                                </button>

                                {/* Eliminar */}
                                <button
                                    onClick={() => deleteSlide(slide.id)}
                                    style={{
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        border: '1px solid rgba(255,0,0,0.2)',
                                        background: 'none',
                                        color: 'rgba(255,80,80,0.5)',
                                        fontFamily: 'var(--font-dm-sans)',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,0,0,0.5)'
                                        e.currentTarget.style.color = '#ff5050'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,0,0,0.2)'
                                        e.currentTarget.style.color = 'rgba(255,80,80,0.5)'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Upload placeholder */}
            <div style={{
                marginTop: '1.5rem',
                border: '2px dashed rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '2rem',
                textAlign: 'center',
            }}>
                <p style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.3)',
                }}>
                    La subida de imágenes se conectará con Firebase Storage
                </p>
            </div>
        </div>
    )
}

function arrowBtnStyle(disabled: boolean): React.CSSProperties {
    return {
        width: 30,
        height: 30,
        borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'none',
        color: disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
    }
}