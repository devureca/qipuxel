'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (loading) return
        if (!user && pathname !== '/admin/login') {
            router.replace('/')
        }
    }, [user, loading, pathname])

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    width: 32,
                    height: 32,
                    border: '2px solid rgba(255,255,255,0.1)',
                    borderTop: '2px solid #fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        )
    }

    if (!user && pathname !== '/admin/login') return null

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f1f1f1' }}>
            {children}
        </div>
    )
}