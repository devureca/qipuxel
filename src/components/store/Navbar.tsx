'use client'

import { useState, useEffect } from 'react'
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
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const visibleCategories = categories
        .filter(cat => cat.visible)
        .sort((a, b) => a.order - b.order)

    return (
        <nav
            className={`
        fixed top-0 left-0 right-0 z-50 px-[5%] transition-all duration-300
        ${scrolled
                    ? darkMode
                        ? 'bg-black/95 backdrop-blur-md border-b border-white/10'
                        : 'bg-white/95 backdrop-blur-md border-b border-black/10'
                    : 'bg-transparent'
                }
      `}
        >
            <div className="max-w-[1280px] mx-auto flex items-center justify-between h-16">

                {/* Logo */}
                <div
                    className="font-display text-3xl tracking-widest cursor-pointer"
                    style={{ color: config.primaryColor }}
                >
                    {config.name}
                </div>

                {/* Menu desktop */}
                <div className="hidden md:flex items-center gap-8">
                    {visibleCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
                            className={`
                font-sans text-xs font-medium tracking-widest uppercase
                border-b-2 pb-1 transition-all duration-200
                ${activeCategory === cat.slug
                                    ? 'border-[var(--color-primary)]'
                                    : 'border-transparent opacity-70 hover:opacity-100'
                                }
                ${darkMode ? 'text-white' : 'text-black'}
              `}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {config.instagram && (
                        <a
                            href={config.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className={`text-xs font-medium tracking-widest opacity-60 hover:opacity-100 transition-opacity ${darkMode ? 'text-white' : 'text-black'}`}
                        >
                            IG
                        </a>
                    )}
                    {config.facebook && (
                        <a
                            href={config.facebook}
                            target="_blank"
                            rel="noreferrer"
                            className={`text-xs font-medium tracking-widest opacity-60 hover:opacity-100 transition-opacity ${darkMode ? 'text-white' : 'text-black'}`}
                        >
                            FB
                        </a>
                    )}

                    {/* Dark mode toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`
              p-2 rounded-full border transition-all duration-200
              ${darkMode
                                ? 'border-white/20 text-white hover:border-white/40'
                                : 'border-black/20 text-black hover:border-black/40'
                            }
            `}
                    >
                        {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                    </button>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`md:hidden p-2 ${darkMode ? 'text-white' : 'text-black'}`}
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className={`md:hidden border-t ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}>
                    {visibleCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.slug); setMenuOpen(false) }}
                            className={`
                block w-full text-left px-6 py-4 text-xs font-medium tracking-widest uppercase
                transition-colors duration-200
                ${darkMode ? 'text-white hover:bg-white/5' : 'text-black hover:bg-black/5'}
                ${activeCategory === cat.slug ? 'opacity-100' : 'opacity-60'}
              `}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    )
}