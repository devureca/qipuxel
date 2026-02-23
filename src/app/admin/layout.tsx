'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Sidebar from '@/components/admin/Sidebar'

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

    const isLogin = pathname === '/admin/login'

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f1f1f1' }}>
            {!isLogin && <Sidebar />}
            <main style={{
                marginLeft: isLogin ? 0 : 240,
                minHeight: '100vh',
                padding: isLogin ? 0 : '2rem',
            }}>
                {children}
            </main>
        </div>
    )
}