'use client'

import { useState } from 'react'
import type { Review } from '@/types'
import { mockReviews } from '@/lib/mockData'

export default function ResenasPage() {
    const [reviews, setReviews] = useState<Review[]>(mockReviews)

    function toggleVisible(id: string) {
        setReviews(prev =>
            prev.map(r => r.id === id ? { ...r, visible: !r.visible } : r)
        )
    }

    function deleteReview(id: string) {
        setReviews(prev => prev.filter(r => r.id !== id))
    }

    return (
        <div style={{ maxWidth: 720 }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '2rem',
                    color: '#fff',
                    letterSpacing: '0.05em',
                }}>
                    RESEÑAS
                </h1>
                <p style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.82rem',
                    color: 'rgba(255,255,255,0.4)',
                }}>
                    {reviews.filter(r => r.visible).length} visibles de {reviews.length} reseñas
                </p>
            </div>

            {/* Lista */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reviews.map(review => (
                    <div
                        key={review.id}
                        style={{
                            background: '#111',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 12,
                            padding: '1.25rem',
                            opacity: review.visible ? 1 : 0.45,
                            transition: 'opacity 0.2s',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '1rem',
                        }}>
                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginBottom: '0.5rem',
                                }}>
                                    {/* Avatar */}
                                    <div style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: 'var(--font-bebas)',
                                        fontSize: '1rem',
                                        color: '#fff',
                                        flexShrink: 0,
                                    }}>
                                        {review.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{
                                            fontFamily: 'var(--font-dm-sans)',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            color: '#fff',
                                        }}>
                                            {review.name}
                                        </p>
                                        <div style={{ display: 'flex', gap: 2 }}>
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <span key={s} style={{
                                                    fontSize: 12,
                                                    color: s <= review.rating ? '#facc15' : 'rgba(255,255,255,0.15)',
                                                }}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p style={{
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.85rem',
                                    color: 'rgba(255,255,255,0.55)',
                                    lineHeight: 1.6,
                                }}>
                                    "{review.text}"
                                </p>
                            </div>

                            {/* Acciones */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                flexShrink: 0,
                            }}>
                                <button
                                    onClick={() => toggleVisible(review.id)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: 6,
                                        border: `1px solid ${review.visible ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                        background: review.visible ? 'rgba(74,222,128,0.1)' : 'transparent',
                                        color: review.visible ? '#4ade80' : 'rgba(255,255,255,0.3)',
                                        fontFamily: 'var(--font-dm-sans)',
                                        fontSize: '0.72rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {review.visible ? 'Visible' : 'Oculta'}
                                </button>

                                <button
                                    onClick={() => deleteReview(review.id)}
                                    style={{
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        border: '1px solid rgba(255,0,0,0.2)',
                                        background: 'none',
                                        color: 'rgba(255,80,80,0.5)',
                                        fontFamily: 'var(--font-dm-sans)',
                                        fontSize: '0.72rem',
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
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}