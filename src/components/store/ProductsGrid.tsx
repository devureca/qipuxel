'use client'

import { useState, useEffect, useRef } from 'react'
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
    showFilters = true,
    limit,
}: ProductsGridProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [conditionFilter, setConditionFilter] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const titleRef = useRef<HTMLDivElement>(null)
    const [titleInView, setTitleInView] = useState(false)

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

    // Por tag específico (ofertas, destacados, nuevos)
    if (filterTag) {
        filtered = filtered.filter(p => p.tags.includes(filterTag as never))
    }

    // Por categoría activa del navbar
    if (activeCategory) {
        const cat = categories.find(c => c.slug === activeCategory)
        if (cat) filtered = filtered.filter(p => p.categoryId === cat.id)
    }

    // Por condición
    if (conditionFilter) {
        filtered = filtered.filter(p => p.condition === conditionFilter)
    }

    // Por estado
    if (statusFilter) {
        filtered = filtered.filter(p => p.status === statusFilter)
    }

    // Límite para secciones destacadas
    if (limit) {
        filtered = filtered.slice(0, limit)
    }

    // Si no hay productos no renderiza nada
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

                    {/* Resultado count */}
                    <p className="font-sans text-sm hidden md:block" style={{ color: '#888' }}>
                        {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
                    </p>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="flex flex-wrap gap-3 mb-10">

                        {/* Condition filter */}
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

                        {/* Status filter */}
                        {[
                            { value: null, label: 'Disponibles y vendidos' },
                            { value: 'available', label: 'Solo disponibles' },
                            { value: 'sold', label: 'Solo vendidos' },
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
                </div>
            </div>

            {/* Modal */}
            <ProductModal
                product={selectedProduct}
                config={config}
                darkMode={darkMode}
                onClose={() => setSelectedProduct(null)}
            />
        </section>
    )
}