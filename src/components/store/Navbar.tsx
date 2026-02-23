'use client'

import { useState } from 'react'
import { Menu, X, Moon, Sun } from 'lucide-react'
import type { StoreConfig, Category } from '@/types'

interface NavbarProps {
    config: StoreConfig
    categories: Category[]
    darkMode: boolean
    setDarkMode: (value: boolean) => void
    activeCategory: string | null
    setActiveCategory: (value: string | null) => void
}

export default function Navbar({
    config,
    categories,
    darkMode,
    setDarkMode,
    activeCategory,
    setActiveCategory,
}: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false)

    const visibleCategories = categories
        .filter(cat => cat.visible)
        .sort((a, b) => a.order - b.order)

    const navBg = darkMode ? '#0a0a0a' : '#ffffff'
    const borderColor = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
    const textColor = darkMode ? '#f1f1f1' : '#111111'

    return (
        <nav
            style={{
                position: 'sticky',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: navBg,
                borderBottom: `1px solid ${borderColor}`,
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    padding: '0 5%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 64,
                    position: 'relative',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: '1.6rem',
                        letterSpacing: '0.1em',
                        color: textColor,
                        cursor: 'pointer',
                        userSelect: 'none',
                    }}
                >
                    {config.name}
                </div>

                {/* Menu desktop - centrado absoluto */}
                <div
                    style={{
                        display: 'none',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        gap: '2.5rem',
                    }}
                    className="md:flex! items-center"
                >
                    {visibleCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
                            style={{
                                background: 'none',
                                border: 'none',
                                borderBottom: `2px solid ${activeCategory === cat.slug ? config.primaryColor : 'transparent'}`,
                                cursor: 'pointer',
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.82rem',
                                fontWeight: 500,
                                letterSpacing: '0.06em',
                                color: activeCategory === cat.slug ? config.primaryColor : textColor,
                                opacity: activeCategory === cat.slug ? 1 : 0.75,
                                transition: 'all 0.2s',
                                padding: '4px 0',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => {
                                if (activeCategory !== cat.slug) e.currentTarget.style.opacity = '0.75'
                            }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {config.instagram && (
                        <a
                            href={config.instagram}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                letterSpacing: '0.08em',
                                color: textColor,
                                opacity: 0.6,
                                textDecoration: 'none',
                                transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                        >
                            IG
                        </a>
                    )}
                    {config.facebook && (
                        <a
                            href={config.facebook}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                letterSpacing: '0.08em',
                                color: textColor,
                                opacity: 0.6,
                                textDecoration: 'none',
                                transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                        >
                            FB
                        </a>
                    )}

                    {/* Dark mode toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        style={{
                            background: 'none',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '50%',
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: textColor,
                            transition: 'all 0.2s',
                        }}
                    >
                        {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                    </button>

                    {/* Mobile hamburger - solo mobile */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex md:hidden"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: textColor,
                            alignItems: 'center',
                        }}
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div
                    style={{ background: navBg, borderTop: `1px solid ${borderColor}` }}
                    className="md:hidden"
                >
                    {visibleCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.slug); setMenuOpen(false) }}
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '1rem 5%',
                                background: 'none',
                                border: 'none',
                                borderBottom: `1px solid ${borderColor}`,
                                cursor: 'pointer',
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                letterSpacing: '0.06em',
                                color: activeCategory === cat.slug ? config.primaryColor : textColor,
                            }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    )
}