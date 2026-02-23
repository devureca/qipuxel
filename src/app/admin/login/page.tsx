'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signIn(email, password)
            router.replace('/admin')
        } catch (err) {
            setError('Email o contraseña incorrectos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 5%',
        }}>
            <div style={{ width: '100%', maxWidth: 400 }}>

                {/* Logo */}
                <div style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '2.5rem',
                    letterSpacing: '0.1em',
                    color: '#fff',
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                }}>
                    QIPUXEL
                </div>
                <p style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.4)',
                    textAlign: 'center',
                    marginBottom: '2.5rem',
                }}>
                    Panel de administración
                </p>

                {/* Form */}
                <div style={{
                    background: '#141414',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    padding: '2rem',
                }}>
                    <form onSubmit={handleSubmit}>

                        {/* Email */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.6)',
                                letterSpacing: '0.05em',
                                display: 'block',
                                marginBottom: '0.5rem',
                            }}>
                                EMAIL
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="admin@tienda.com"
                                style={{
                                    width: '100%',
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    padding: '12px 14px',
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.9rem',
                                    color: '#fff',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.6)',
                                letterSpacing: '0.05em',
                                display: 'block',
                                marginBottom: '0.5rem',
                            }}>
                                CONTRASEÑA
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    padding: '12px 14px',
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.9rem',
                                    color: '#fff',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.82rem',
                                color: '#ff4444',
                                marginBottom: '1rem',
                                textAlign: 'center',
                            }}>
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                background: '#fff',
                                color: '#111',
                                border: 'none',
                                borderRadius: 8,
                                padding: '13px',
                                fontFamily: 'var(--font-dm-sans)',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                                transition: 'opacity 0.2s, transform 0.2s',
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}