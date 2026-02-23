'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, Category, StoreConfig } from '@/types'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'

interface ProductsGridProps {
    products: Product[]
    categories: Category[]
    config: StoreConfig
    darkMode: boolean
    activeCategory: string | null
    setActiveCategory: (value: string | null) => void
    title?: string
    label?: string
    filterTag?: string
    showFilters?: boolean
    limit?: number
    showViewAll?: boolean
}

export default function ProductsGrid({
    products,
    categories,
    config,
    darkMode,
    activeCategory,
    setActiveCategory,
    title = 'Productos',
    label = 'Catálogo',
    filterTag,
    showFilters = false,
    limit,
    showViewAll = false,
}: ProductsGridProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [conditionFilter, setConditionFilter] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const titleRef = useRef<HTMLDivElement>(null)
    const [titleInView, setTitleInView] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setTitleInView(true) },
            { threshold: 0.1 }
        )
        if (titleRef.current) obs.observe(titleRef.current)
        return () => obs.disconnect()
    }, [])

    // Filtrar productos
    let filtered = products

    if (filterTag) {
        filtered = filtered.filter(p => p.tags.includes(filterTag as never))
    }

    if (activeCategory) {
        const cat = categories.find(c => c.slug === activeCategory)
        if (cat) filtered = filtered.filter(p => p.categoryId === cat.id)
    }

    if (conditionFilter) {
        filtered = filtered.filter(p => p.condition === conditionFilter)
    }

    if (statusFilter) {
        filtered = filtered.filter(p => p.status === statusFilter)
    }

    if (limit) {
        filtered = filtered.slice(0, limit)
    }

    if (!filtered.length && !showFilters) return null

    return (
        <section className="py-20 px-[5%]">
            <div className="max-w-[1280px] mx-auto">

                {/* Title */}
                <div
                    ref={titleRef}
                    className="flex items-end justify-between mb-10 transition-all duration-600"
                    style={{
                        opacity: titleInView ? 1 : 0,
                        transform: titleInView ? 'translateY(0)' : 'translateY(24px)',
                    }}
                >
                    <div>
                        <p className="font-sans text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#888' }}>
                            {label}
                        </p>
                        <h2
                            className="font-display text-5xl tracking-wide leading-none"
                            style={{ color: darkMode ? '#f1f1f1' : '#111' }}
                        >
                            {title}
                        </h2>
                    </div>

                    <p className="font-sans text-sm hidden md:block" style={{ color: '#888' }}>
                        {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
                    </p>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="flex flex-wrap gap-3 mb-10">
                        {[
                            { value: null, label: 'Todos' },
                            { value: 'sealed', label: 'Sellados' },
                            { value: 'like_new', label: 'Como nuevo' },
                            { value: 'good', label: 'Buen estado' },
                            { value: 'fair', label: 'Con detalles' },
                        ].map(opt => (
                            <button
                                key={opt.label}
                                onClick={() => setConditionFilter(opt.value)}
                                className="font-sans text-xs tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-200"
                                style={{
                                    background: conditionFilter === opt.value ? config.primaryColor : 'transparent',
                                    color: conditionFilter === opt.value ? '#fff' : darkMode ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
                                    borderColor: conditionFilter === opt.value ? config.primaryColor : darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}

                        <div className="w-px mx-1" style={{ background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

                        {[
                            { value: null, label: 'Todos' },
                            { value: 'available', label: 'Disponibles' },
                            { value: 'sold', label: 'Vendidos' },
                        ].map(opt => (
                            <button
                                key={opt.label}
                                onClick={() => setStatusFilter(opt.value)}
                                className="font-sans text-xs tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-200"
                                style={{
                                    background: statusFilter === opt.value ? config.primaryColor : 'transparent',
                                    color: statusFilter === opt.value ? '#fff' : darkMode ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
                                    borderColor: statusFilter === opt.value ? config.primaryColor : darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="py-24 text-center">
                        <p className="font-display text-4xl mb-3" style={{ color: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>
                            SIN RESULTADOS
                        </p>
                        <p className="font-sans text-sm" style={{ color: '#888' }}>
                            Probá con otros filtros
                        </p>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    {filtered.map((product, i) => (
                        <div
                            key={product.id}
                            className="transition-all duration-500"
                            style={{
                                opacity: titleInView ? 1 : 0,
                                transform: titleInView ? 'translateY(0)' : 'translateY(24px)',
                                transitionDelay: `${Math.min(i * 60, 400)}ms`,
                            }}
                        >
                            <ProductCard
                                product={product}
                                config={config}
                                darkMode={darkMode}
                                onOpen={setSelectedProduct}
                            />
                        </div>
                    ))}

                    {/* Card ver todo el catálogo */}
                    {showViewAll && (
                        <div
                            onClick={() => router.push('/catalogo')}
                            className="transition-all duration-500"
                            style={{
                                opacity: titleInView ? 1 : 0,
                                transform: titleInView ? 'translateY(0)' : 'translateY(24px)',
                                transitionDelay: `${Math.min(filtered.length * 60, 400)}ms`,
                            }}
                        >
                            <div
                                style={{
                                    borderRadius: 16,
                                    overflow: 'hidden',
                                    aspectRatio: '3/4',
                                    background: config.primaryColor,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'scale(1.02)'
                                    e.currentTarget.style.boxShadow = `0 16px 48px ${config.primaryColor}55`
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'scale(1)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'var(--font-bebas)',
                                        fontSize: '2.2rem',
                                        color: '#fff',
                                        letterSpacing: '0.05em',
                                        textAlign: 'center',
                                        padding: '0 1.5rem',
                                        lineHeight: 1.1,
                                        marginBottom: '1.5rem',
                                    }}
                                >
                                    VER TODO EL CATÁLOGO
                                </span>
                                <div
                                    style={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ProductModal
                product={selectedProduct}
                config={config}
                darkMode={darkMode}
                onClose={() => setSelectedProduct(null)}
            />
        </section>
    )
}