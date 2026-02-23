'use client'

import { useState } from 'react'
import type { Product } from '@/types'
import { mockProducts } from '@/lib/mockData'

export default function ProductosPage() {
    const [products, setProducts] = useState<Product[]>(mockProducts)
    const [search, setSearch] = useState('')

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
            }}>
                <div>
                    <h1 style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: '2rem',
                        color: '#fff',
                        letterSpacing: '0.05em',
                    }}>
                        PRODUCTOS
                    </h1>
                    <p style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.4)',
                    }}>
                        {products.length} productos en total
                    </p>
                </div>
                <button
                    onClick={() => window.location.href = '/admin/productos/nuevo'}
                    style={{
                        background: '#fff',
                        color: '#111',
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 20px',
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                    }}
                >
                    + Nuevo producto
                </button>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                    width: '100%',
                    background: '#141414',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    padding: '12px 16px',
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.9rem',
                    color: '#fff',
                    outline: 'none',
                    marginBottom: '1.5rem',
                    boxSizing: 'border-box',
                }}
            />

            {/* Table */}
            <div style={{
                background: '#111',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                overflow: 'hidden',
            }}>
                {/* Table header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 120px 100px 120px 80px',
                    padding: '0.75rem 1.25rem',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: '#0d0d0d',
                }}>
                    {['', 'Nombre', 'Consola', 'Precio', 'Estado', ''].map((h, i) => (
                        <span key={i} style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.3)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}>
                            {h}
                        </span>
                    ))}
                </div>

                {/* Rows */}
                {filtered.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}>
                            No hay productos
                        </p>
                    </div>
                ) : (
                    filtered.map((product, i) => (
                        <div
                            key={product.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '60px 1fr 120px 100px 120px 80px',
                                padding: '0.875rem 1.25rem',
                                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                alignItems: 'center',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            {/* Imagen */}
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: 6,
                                overflow: 'hidden',
                                background: '#1a1a1a',
                            }}>
                                {product.images[0] && (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                )}
                            </div>

                            {/* Nombre */}
                            <div>
                                <p style={{
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#fff',
                                    marginBottom: 2,
                                }}>
                                    {product.name}
                                </p>
                                <p style={{
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.75rem',
                                    color: 'rgba(255,255,255,0.3)',
                                }}>
                                    {product.condition === 'sealed' ? 'Sellado' :
                                        product.condition === 'like_new' ? 'Como nuevo' :
                                            product.condition === 'good' ? 'Buen estado' : 'Con detalles'}
                                </p>
                            </div>

                            {/* Consola */}
                            <span style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.8rem',
                                color: 'rgba(255,255,255,0.5)',
                            }}>
                                {product.console || '—'}
                            </span>

                            {/* Precio */}
                            <span style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#fff',
                            }}>
                                ${product.price.toLocaleString()}
                            </span>

                            {/* Estado */}
                            <span style={{
                                display: 'inline-block',
                                padding: '3px 10px',
                                borderRadius: 100,
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                background: product.status === 'available'
                                    ? 'rgba(34,197,94,0.15)'
                                    : product.status === 'reserved'
                                        ? 'rgba(234,179,8,0.15)'
                                        : 'rgba(255,255,255,0.08)',
                                color: product.status === 'available'
                                    ? '#4ade80'
                                    : product.status === 'reserved'
                                        ? '#facc15'
                                        : 'rgba(255,255,255,0.4)',
                            }}>
                                {product.status === 'available' ? 'Disponible' :
                                    product.status === 'reserved' ? 'Reservado' : 'Vendido'}
                            </span>

                            {/* Acciones */}
                            <button
                                onClick={() => window.location.href = `/admin/productos/${product.id}`}
                                style={{
                                    background: 'none',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 6,
                                    padding: '6px 12px',
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.75rem',
                                    color: 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = '#fff'
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                                }}
                            >
                                Editar
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}