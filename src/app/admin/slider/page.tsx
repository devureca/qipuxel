'use client'

import { useState, useEffect } from 'react'
import type { SliderBanner } from '@/types'
import { getSlides, updateSlide, deleteSlide } from '@/lib/firestore'

export default function SliderPage() {
    const [slides, setSlides] = useState<SliderBanner[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSlides()
    }, [])

    async function fetchSlides() {
        setLoading(true)
        try {
            const data = await getSlides()
            setSlides(data as SliderBanner[])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function toggleActive(slide: SliderBanner) {
        await updateSlide(slide.id, { active: !slide.active })
        fetchSlides()
    }

    async function moveUp(index: number) {
        if (index === 0) return
        const a = slides[index - 1]
        const b = slides[index]
        await updateSlide(a.id, { order: b.order })
        await updateSlide(b.id, { order: a.order })
        fetchSlides()
    }

    async function moveDown(index: number) {
        if (index === slides.length - 1) return
        const a = slides[index]
        const b = slides[index + 1]
        await updateSlide(a.id, { order: b.order })
        await updateSlide(b.id, { order: a.order })
        fetchSlides()
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Eliminar este slide?')) return
        await deleteSlide(id)
        fetchSlides()
    }

    const sorted = [...slides].sort((a, b) => a.order - b.order)

    return (
        <div style={{ maxWidth: 720 }}>
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
            </div>

            {loading ? (
                <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '3rem' }}>
                    Cargando slides...
                </p>
            ) : sorted.length === 0 ? (
                <div style={{
                    border: '2px dashed rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    padding: '3rem',
                    textAlign: 'center',
                }}>
                    <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}>
                        No hay slides todavía. Agregá imágenes desde Firebase Storage.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {sorted.map((slide, i) => (
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
                            <div style={{
                                width: 80,
                                height: 56,
                                borderRadius: 8,
                                overflow: 'hidden',
                                background: '#1a1a1a',
                            }}>
                                <img
                                    src={slide.image}
                                    alt={`Slide ${i + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

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

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button onClick={() => moveUp(i)} disabled={i === 0} style={arrowBtnStyle(i === 0)}>↑</button>
                                <button onClick={() => moveDown(i)} disabled={i === sorted.length - 1} style={arrowBtnStyle(i === sorted.length - 1)}>↓</button>

                                <button
                                    onClick={() => toggleActive(slide)}
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

                                <button
                                    onClick={() => handleDelete(slide.id)}
                                    style={{
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        border: '1px solid rgba(255,0,0,0.2)',
                                        background: 'none',
                                        color: 'rgba(255,80,80,0.5)',
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
            )}
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
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
    }
}