'use client'

import { useState } from 'react'
import type { Category } from '@/types'
import { mockCategories } from '@/lib/mockData'

export default function CategoriasPage() {
    const [categories, setCategories] = useState<Category[]>(mockCategories)
    const [newName, setNewName] = useState('')
    const [adding, setAdding] = useState(false)

    function toggleVisible(id: string) {
        setCategories(prev =>
            prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c)
        )
    }

    function moveUp(index: number) {
        if (index === 0) return
        const updated = [...categories]
            ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
        setCategories(updated.map((c, i) => ({ ...c, order: i + 1 })))
    }

    function moveDown(index: number) {
        if (index === categories.length - 1) return
        const updated = [...categories]
            ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
        setCategories(updated.map((c, i) => ({ ...c, order: i + 1 })))
    }

    function deleteCategory(id: string) {
        setCategories(prev => prev.filter(c => c.id !== id))
    }

    function addCategory() {
        if (!newName.trim()) return
        const slug = newName.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        const newCat: Category = {
            id: Date.now().toString(),
            name: newName.trim(),
            slug,
            order: categories.length + 1,
            visible: true,
        }
        setCategories(prev => [...prev, newCat])
        setNewName('')
        setAdding(false)
    }

    const sorted = [...categories].sort((a, b) => a.order - b.order)

    return (
        <div style={{ maxWidth: 600 }}>
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
                        CATEGORÍAS
                    </h1>
                    <p style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.4)',
                    }}>
                        {categories.filter(c => c.visible).length} visibles en el menú
                    </p>
                </div>
                <button
                    onClick={() => setAdding(true)}
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
                    }}
                >
                    + Nueva categoría
                </button>
            </div>

            {/* Formulario nueva categoría */}
            {adding && (
                <div style={{
                    background: '#111',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    padding: '1.25rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center',
                }}>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Nombre de la categoría"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addCategory()}
                        style={{
                            flex: 1,
                            background: '#0a0a0a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            padding: '10px 14px',
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.9rem',
                            color: '#fff',
                            outline: 'none',
                        }}
                    />
                    <button
                        onClick={addCategory}
                        style={{
                            background: '#fff',
                            color: '#111',
                            border: 'none',
                            borderRadius: 8,
                            padding: '10px 16px',
                            fontFamily: 'var(--font-dm-sans)',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                        }}
                    >
                        Agregar
                    </button>
                    <button
                        onClick={() => { setAdding(false); setNewName('') }}
                        style={{
                            background: 'none',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            padding: '10px 14px',
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.85rem',
                            color: 'rgba(255,255,255,0.4)',
                            cursor: 'pointer',
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            )}

            {/* Lista */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sorted.map((cat, i) => (
                    <div
                        key={cat.id}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            alignItems: 'center',
                            gap: '1rem',
                            background: '#111',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 10,
                            padding: '0.875rem 1rem',
                            opacity: cat.visible ? 1 : 0.5,
                            transition: 'opacity 0.2s',
                        }}
                    >
                        {/* Nombre + slug */}
                        <div>
                            <p style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: '#fff',
                                marginBottom: 2,
                            }}>
                                {cat.name}
                            </p>
                            <p style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.72rem',
                                color: 'rgba(255,255,255,0.25)',
                            }}>
                                /{cat.slug}
                            </p>
                        </div>

                        {/* Acciones */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button onClick={() => moveUp(i)} disabled={i === 0} style={arrowBtnStyle(i === 0)}>↑</button>
                            <button onClick={() => moveDown(i)} disabled={i === sorted.length - 1} style={arrowBtnStyle(i === sorted.length - 1)}>↓</button>

                            <button
                                onClick={() => toggleVisible(cat.id)}
                                style={{
                                    padding: '5px 12px',
                                    borderRadius: 6,
                                    border: `1px solid ${cat.visible ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                    background: cat.visible ? 'rgba(74,222,128,0.1)' : 'transparent',
                                    color: cat.visible ? '#4ade80' : 'rgba(255,255,255,0.3)',
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {cat.visible ? 'Visible' : 'Oculta'}
                            </button>

                            <button
                                onClick={() => deleteCategory(cat.id)}
                                style={{
                                    padding: '5px 10px',
                                    borderRadius: 6,
                                    border: '1px solid rgba(255,0,0,0.2)',
                                    background: 'none',
                                    color: 'rgba(255,80,80,0.5)',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'rgba(255,0,0,0.5)'
                                    e.currentTarget.style.color = '#ff5050'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'rgba(255,0,0,0.2)'
                                    e.currentTarget.style.color = 'rgba(255,80,80,0.5)'
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function arrowBtnStyle(disabled: boolean): React.CSSProperties {
    return {
        width: 30,
        height: 30,
        borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'none',
        color: disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
    }
}