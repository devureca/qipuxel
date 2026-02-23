'use client'

import { useState, useEffect } from 'react'
import type { Category } from '@/types'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/firestore'

export default function CategoriasPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [newName, setNewName] = useState('')
    const [adding, setAdding] = useState(false)

    useEffect(() => { fetchCategories() }, [])

    async function fetchCategories() {
        setLoading(true)
        try {
            const data = await getCategories()
            setCategories(data as Category[])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function toggleVisible(cat: Category) {
        await updateCategory(cat.id, { visible: !cat.visible })
        fetchCategories()
    }

    async function moveUp(index: number) {
        if (index === 0) return
        const a = sorted[index - 1]
        const b = sorted[index]
        await updateCategory(a.id, { order: b.order })
        await updateCategory(b.id, { order: a.order })
        fetchCategories()
    }

    async function moveDown(index: number) {
        if (index === sorted.length - 1) return
        const a = sorted[index]
        const b = sorted[index + 1]
        await updateCategory(a.id, { order: b.order })
        await updateCategory(b.id, { order: a.order })
        fetchCategories()
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Eliminar esta categoría?')) return
        await deleteCategory(id)
        fetchCategories()
    }

    async function addCategory() {
        if (!newName.trim()) return
        const slug = newName.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
        await createCategory({
            name: newName.trim(),
            slug,
            order: categories.length + 1,
            visible: true,
        })
        setNewName('')
        setAdding(false)
        fetchCategories()
    }

    const sorted = [...categories].sort((a, b) => a.order - b.order)

    return (
        <div style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', color: '#fff', letterSpacing: '0.05em' }}>CATEGORÍAS</h1>
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>
                        {categories.filter(c => c.visible).length} visibles en el menú
                    </p>
                </div>
                <button onClick={() => setAdding(true)} style={primaryBtnStyle}>+ Nueva categoría</button>
            </div>

            {adding && (
                <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Nombre de la categoría"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addCategory()}
                        style={inputStyle}
                    />
                    <button onClick={addCategory} style={primaryBtnStyle}>Agregar</button>
                    <button onClick={() => { setAdding(false); setNewName('') }} style={cancelBtnStyle}>Cancelar</button>
                </div>
            )}

            {loading ? (
                <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '3rem' }}>Cargando...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {sorted.map((cat, i) => (
                        <div key={cat.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '1rem', background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '0.875rem 1rem', opacity: cat.visible ? 1 : 0.5, transition: 'opacity 0.2s' }}>
                            <div>
                                <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 600, fontSize: '0.9rem', color: '#fff', marginBottom: 2 }}>{cat.name}</p>
                                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>/{cat.slug}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button onClick={() => moveUp(i)} disabled={i === 0} style={arrowBtnStyle(i === 0)}>↑</button>
                                <button onClick={() => moveDown(i)} disabled={i === sorted.length - 1} style={arrowBtnStyle(i === sorted.length - 1)}>↓</button>
                                <button onClick={() => toggleVisible(cat)} style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${cat.visible ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`, background: cat.visible ? 'rgba(74,222,128,0.1)' : 'transparent', color: cat.visible ? '#4ade80' : 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-dm-sans)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>
                                    {cat.visible ? 'Visible' : 'Oculta'}
                                </button>
                                <button onClick={() => handleDelete(cat.id)} style={deleteBtnStyle} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,0,0,0.5)'; e.currentTarget.style.color = '#ff5050' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,0,0,0.2)'; e.currentTarget.style.color = 'rgba(255,80,80,0.5)' }}>✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function arrowBtnStyle(disabled: boolean): React.CSSProperties {
    return { width: 30, height: 30, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }
}
const primaryBtnStyle: React.CSSProperties = { background: '#fff', color: '#111', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'var(--font-dm-sans)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }
const cancelBtnStyle: React.CSSProperties = { background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', fontFamily: 'var(--font-dm-sans)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }
const deleteBtnStyle: React.CSSProperties = { padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(255,0,0,0.2)', background: 'none', color: 'rgba(255,80,80,0.5)', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s' }
const inputStyle: React.CSSProperties = { flex: 1, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', fontFamily: 'var(--font-dm-sans)', fontSize: '0.9rem', color: '#fff', outline: 'none' }