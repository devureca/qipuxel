'use client'

import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firestore'

interface ReviewFormProps {
    darkMode: boolean
    primaryColor: string
    onClose?: () => void
}

export default function ReviewForm({ darkMode, primaryColor, onClose }: ReviewFormProps) {
    const [name, setName] = useState('')
    const [rating, setRating] = useState(0)
    const [hovered, setHovered] = useState(0)
    const [text, setText] = useState('')
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    async function handleSubmit() {
        if (!name.trim() || !rating || !text.trim()) return
        setSending(true)
        try {
            await addDoc(collection(db, 'reviews'), {
                name: name.trim(),
                rating,
                text: text.trim(),
                visible: false,
                createdAt: new Date().toISOString(),
            })
            setSent(true)
            setName('')
            setRating(0)
            setText('')
            // Cerrar modal después de un momento
            setTimeout(() => onClose?.(), 2500)
        } catch (err) {
            console.error(err)
            alert('Error al enviar la reseña')
        } finally {
            setSending(false)
        }
    }

    const borderColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
    const bg = darkMode ? '#141414' : '#fff'
    const textColor = darkMode ? '#f1f1f1' : '#111'
    const mutedColor = darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
    const inputBg = darkMode ? '#0a0a0a' : '#f7f6f3'
    const inputBorder = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'

    if (sent) {
        return (
            <div style={{
                background: bg,
                border: `1px solid ${borderColor}`,
                borderRadius: 16,
                padding: '2rem',
                textAlign: 'center',
            }}>
                <p style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '1.5rem',
                    color: primaryColor,
                    marginBottom: '0.5rem',
                    letterSpacing: '0.05em',
                }}>
                    ¡Gracias por tu reseña!
                </p>
                <p style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.875rem',
                    color: mutedColor,
                }}>
                    La revisaremos y la publicaremos pronto.
                </p>
                <button
                    onClick={() => onClose?.()}
                    style={{
                        marginTop: '1.25rem',
                        background: 'none',
                        border: `1px solid ${borderColor}`,
                        borderRadius: 8,
                        padding: '8px 20px',
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.82rem',
                        color: mutedColor,
                        cursor: 'pointer',
                    }}
                >
                    Cerrar
                </button>
            </div>
        )
    }

    return (
        <div style={{
            background: bg,
            border: `1px solid ${borderColor}`,
            borderRadius: 16,
            padding: '2rem',
        }}>
            {/* Header con X para cerrar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <p style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: textColor,
                }}>
                    Deja tu reseña
                </p>
                <button
                    onClick={() => onClose?.()}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: mutedColor,
                        fontSize: '1.2rem',
                        padding: 4,
                        lineHeight: 1,
                    }}
                >
                    ✕
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Nombre */}
                <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                        width: '100%',
                        background: inputBg,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: 8,
                        padding: '11px 14px',
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.9rem',
                        color: textColor,
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                />

                {/* Estrellas */}
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                        <button
                            key={s}
                            onClick={() => setRating(s)}
                            onMouseEnter={() => setHovered(s)}
                            onMouseLeave={() => setHovered(0)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.75rem',
                                color: s <= (hovered || rating) ? primaryColor : (darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'),
                                transition: 'color 0.15s, transform 0.1s',
                                transform: s <= hovered ? 'scale(1.2)' : 'scale(1)',
                                padding: 0,
                            }}
                        >
                            ★
                        </button>
                    ))}
                </div>

                {/* Texto */}
                <textarea
                    placeholder="Cuéntanos tu experiencia..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={3}
                    style={{
                        width: '100%',
                        background: inputBg,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: 8,
                        padding: '11px 14px',
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.9rem',
                        color: textColor,
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                    }}
                />

                {/* Botón */}
                <button
                    onClick={handleSubmit}
                    disabled={sending || !name || !rating || !text}
                    style={{
                        background: primaryColor,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '12px',
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: sending || !name || !rating || !text ? 'not-allowed' : 'pointer',
                        opacity: sending || !name || !rating || !text ? 0.5 : 1,
                        transition: 'opacity 0.2s',
                    }}
                >
                    {sending ? 'Enviando...' : 'Enviar reseña'}
                </button>
            </div>
        </div>
    )
}