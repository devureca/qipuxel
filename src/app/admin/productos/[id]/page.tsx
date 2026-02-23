'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { mockProducts } from '@/lib/mockData'
import type { Product } from '@/types'

const CONSOLES = ['Nintendo 64', 'PlayStation', 'PlayStation 2', 'PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'Xbox', 'Xbox 360', 'Xbox One', 'Nintendo Switch', 'Game Boy', 'SNES', 'Sega', 'PC', 'Otro']

const EMPTY_PRODUCT: Omit<Product, 'id' | 'createdAt'> = {
    name: '',
    price: 0,
    description: '',
    images: [],
    categoryId: '',
    console: '',
    condition: 'good',
    complete: false,
    region: '',
    status: 'available',
    tags: [],
}

export default function ProductoFormPage() {
    const router = useRouter()
    const params = useParams()
    const isNew = params.id === 'nuevo'

    const existing = isNew ? null : mockProducts.find(p => p.id === params.id)
    const [form, setForm] = useState(existing ?? { ...EMPTY_PRODUCT })
    const [saving, setSaving] = useState(false)

    function update(key: string, value: unknown) {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    function toggleTag(tag: string) {
        const tags = (form.tags ?? []) as string[]
        update('tags', tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])
    }

    async function handleSave() {
        setSaving(true)
        // Por ahora solo simula guardado, después conectamos Firebase
        await new Promise(r => setTimeout(r, 800))
        setSaving(false)
        router.push('/admin/productos')
    }

    return (
        <div style={{ maxWidth: 720 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => router.push('/admin/productos')}
                    style={{
                        background: 'none',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        padding: '8px 12px',
                        color: 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.8rem',
                    }}
                >
                    ← Volver
                </button>
                <h1 style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '2rem',
                    color: '#fff',
                    letterSpacing: '0.05em',
                }}>
                    {isNew ? 'NUEVO PRODUCTO' : 'EDITAR PRODUCTO'}
                </h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Nombre */}
                <Field label="NOMBRE">
                    <Input
                        value={form.name}
                        onChange={v => update('name', v)}
                        placeholder="Ej: Super Mario Bros"
                    />
                </Field>

                {/* Precio */}
                <Field label="PRECIO">
                    <Input
                        type="number"
                        value={form.price.toString()}
                        onChange={v => update('price', Number(v))}
                        placeholder="0"
                    />
                </Field>

                {/* Descripción */}
                <Field label="DESCRIPCIÓN">
                    <textarea
                        value={form.description ?? ''}
                        onChange={e => update('description', e.target.value)}
                        placeholder="Descripción del producto..."
                        rows={3}
                        style={{
                            width: '100%',
                            background: '#141414',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 8,
                            padding: '12px 14px',
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.9rem',
                            color: '#fff',
                            outline: 'none',
                            resize: 'vertical',
                            boxSizing: 'border-box',
                        }}
                    />
                </Field>

                {/* Consola */}
                <Field label="CONSOLA">
                    <select
                        value={form.console ?? ''}
                        onChange={e => update('console', e.target.value)}
                        style={{
                            width: '100%',
                            background: '#141414',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 8,
                            padding: '12px 14px',
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.9rem',
                            color: form.console ? '#fff' : 'rgba(255,255,255,0.3)',
                            outline: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="">Seleccioná una consola</option>
                        {CONSOLES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </Field>

                {/* Condición + Estado en fila */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Field label="CONDICIÓN">
                        <select
                            value={form.condition}
                            onChange={e => update('condition', e.target.value)}
                            style={selectStyle}
                        >
                            <option value="sealed">Sellado</option>
                            <option value="like_new">Como nuevo</option>
                            <option value="good">Buen estado</option>
                            <option value="fair">Con detalles</option>
                        </select>
                    </Field>

                    <Field label="ESTADO">
                        <select
                            value={form.status}
                            onChange={e => update('status', e.target.value)}
                            style={selectStyle}
                        >
                            <option value="available">Disponible</option>
                            <option value="reserved">Reservado</option>
                            <option value="sold">Vendido</option>
                        </select>
                    </Field>
                </div>

                {/* Completo */}
                <Field label="COMPLETO (con caja, manual, etc)">
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {[{ label: 'Sí', value: true }, { label: 'No', value: false }].map(opt => (
                            <button
                                key={String(opt.value)}
                                onClick={() => update('complete', opt.value)}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: 8,
                                    border: `1px solid ${form.complete === opt.value ? '#fff' : 'rgba(255,255,255,0.1)'}`,
                                    background: form.complete === opt.value ? '#fff' : 'transparent',
                                    color: form.complete === opt.value ? '#111' : 'rgba(255,255,255,0.5)',
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </Field>

                {/* Tags */}
                <Field label="ETIQUETAS">
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {['offer', 'featured', 'new', 'slider'].map(tag => {
                            const active = (form.tags as string[]).includes(tag)
                            return (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: 100,
                                        border: `1px solid ${active ? '#fff' : 'rgba(255,255,255,0.1)'}`,
                                        background: active ? '#fff' : 'transparent',
                                        color: active ? '#111' : 'rgba(255,255,255,0.5)',
                                        fontFamily: 'var(--font-dm-sans)',
                                        fontWeight: 600,
                                        fontSize: '0.78rem',
                                        letterSpacing: '0.05em',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {tag === 'offer' ? 'Oferta' :
                                        tag === 'featured' ? 'Destacado' :
                                            tag === 'new' ? 'Nuevo' : 'Slider'}
                                </button>
                            )
                        })}
                    </div>
                </Field>

                {/* Imágenes - placeholder por ahora */}
                <Field label="IMÁGENES (máx. 4)">
                    <div style={{
                        border: '2px dashed rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        padding: '2rem',
                        textAlign: 'center',
                    }}>
                        <p style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.85rem',
                            color: 'rgba(255,255,255,0.3)',
                            marginBottom: '0.5rem',
                        }}>
                            La subida de imágenes se conectará con Firebase Storage
                        </p>
                        <p style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.75rem',
                            color: 'rgba(255,255,255,0.2)',
                        }}>
                            Por ahora usá las URLs del mockData
                        </p>
                    </div>
                </Field>

                {/* Botones */}
                <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            flex: 1,
                            background: '#fff',
                            color: '#111',
                            border: 'none',
                            borderRadius: 8,
                            padding: '13px',
                            fontFamily: 'var(--font-dm-sans)',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.6 : 1,
                            transition: 'opacity 0.2s',
                        }}
                    >
                        {saving ? 'Guardando...' : isNew ? 'Crear producto' : 'Guardar cambios'}
                    </button>

                    {!isNew && (
                        <button
                            style={{
                                padding: '13px 20px',
                                background: 'none',
                                border: '1px solid rgba(255,0,0,0.3)',
                                borderRadius: 8,
                                fontFamily: 'var(--font-dm-sans)',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: 'rgba(255,80,80,0.7)',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,0,0,0.6)'
                                e.currentTarget.style.color = '#ff5050'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,0,0,0.3)'
                                e.currentTarget.style.color = 'rgba(255,80,80,0.7)'
                            }}
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// Componentes auxiliares
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.1em',
                display: 'block',
                marginBottom: '0.5rem',
            }}>
                {label}
            </label>
            {children}
        </div>
    )
}

function Input({ value, onChange, placeholder, type = 'text' }: {
    value: string
    onChange: (v: string) => void
    placeholder?: string
    type?: string
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                width: '100%',
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                padding: '12px 14px',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.9rem',
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
        />
    )
}

const selectStyle = {
    width: '100%',
    background: '#141414',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: '12px 14px',
    fontFamily: 'var(--font-dm-sans)',
    fontSize: '0.9rem',
    color: '#fff',
    outline: 'none',
    cursor: 'pointer',
} as React.CSSProperties