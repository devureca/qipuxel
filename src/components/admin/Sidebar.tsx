'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

const MENU = [
    { label: 'Productos', href: '/admin/productos', icon: '📦' },
    { label: 'Slider', href: '/admin/slider', icon: '🖼️' },
    { label: 'Categorías', href: '/admin/categorias', icon: '📂' },
    { label: 'Reseñas', href: '/admin/resenas', icon: '⭐' },
    { label: 'Marcas', href: '/admin/marcas', icon: '🏷️' },
    { label: 'Configuración', href: '/admin/configuracion', icon: '⚙️' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { signOut } = useAuth()
    const [signingOut, setSigningOut] = useState(false)

    async function handleSignOut() {
        setSigningOut(true)
        await signOut()
        router.replace('/')
    }

    return (
        <aside style={{
            width: 240,
            minHeight: '100vh',
            background: '#111',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 50,
        }}>
            {/* Logo */}
            <div style={{
                padding: '1.75rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <div style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '1.6rem',
                    letterSpacing: '0.1em',
                    color: '#fff',
                }}>
                    QIPUXEL
                </div>
                <p style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.3)',
                    marginTop: 2,
                }}>
                    Panel de administración
                </p>
            </div>

            {/* Menu */}
            <nav style={{ flex: 1, padding: '1rem 0' }}>
                {MENU.map(item => {
                    const active = pathname.startsWith(item.href)
                    return (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                width: '100%',
                                padding: '0.75rem 1.5rem',
                                background: active ? 'rgba(255,255,255,0.06)' : 'none',
                                border: 'none',
                                borderLeft: `3px solid ${active ? '#fff' : 'transparent'}`,
                                cursor: 'pointer',
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.875rem',
                                fontWeight: active ? 600 : 400,
                                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                                textAlign: 'left',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
                        >
                            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    )
                })}
            </nav>

            {/* Footer - ver tienda + cerrar sesión */}
            <div style={{
                padding: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
            }}>
                <button
                    onClick={() => window.open('/', '_blank')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.45)',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    }}
                >
                    <span>🌐</span> Ver tienda
                </button>

                <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.3)',
                        transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ff4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >
                    <span>🚪</span> {signingOut ? 'Saliendo...' : 'Cerrar sesión'}
                </button>
            </div>
        </aside>
    )
}