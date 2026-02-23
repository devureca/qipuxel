'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getProduct, createProduct, updateProduct, deleteProduct, getCategories } from '@/lib/firestore'
import { uploadImage, deleteImage } from '@/lib/storage'
import type { Product, Category } from '@/types'

const CONSOLES = ['Nintendo 64', 'PlayStation', 'PlayStation 2', 'PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'Xbox', 'Xbox 360', 'Xbox One', 'Nintendo Switch', 'Game Boy', 'SNES', 'Sega', 'PC', 'Otro']

const EMPTY_PRODUCT = {
    name: '',
    price: 0,
    description: '',
    images: [] as string[],
    categoryId: '',
    console: '',
    condition: 'good' as const,
    complete: false,
    region: '',
    status: 'available' as const,
    tags: [] as string[],
}

export default function ProductoFormPage() {
    const router = useRouter()
    const params = useParams()
    const isNew = params.id === 'nuevo'

    const [form, setForm] = useState(EMPTY_PRODUCT)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchCategories()
        if (!isNew) fetchProduct()
    }, [])

    async function fetchCategories() {
        try {
            const data = await getCategories()
            setCategories(data as Category[])
        } catch (err) {
            console.error(err)
        }
    }

    async function fetchProduct() {
        try {
            const data = await getProduct(params.id as string)
            if (data) setForm(data as unknown as typeof EMPTY_PRODUCT)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    function update(key: string, value: unknown) {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    function toggleTag(tag: string) {
        const tags = form.tags ?? []
        update('tags', tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])
    }

    async function handleSave() {
        if (!form.name || !form.price) return alert('Nombre y precio son obligatorios')
        setSaving(true)
        try {
            if (isNew) {
                await createProduct(form)
            } else {
                await updateProduct(params.id as string, form)
            }
            router.push('/admin/productos')
        } catch (err) {
            console.error(err)
            alert('Error al guardar el producto')
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete() {
        if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
        setDeleting(true)
        try {
            await deleteProduct(params.id as string)
            router.push('/admin/productos')
        } catch (err) {
            console.error(err)
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'rgba(255,255,255,0.25)' }}>
                    Cargando producto...
                </p>
            </div>
        )
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

                <Field label="NOMBRE">
                    <Input value={form.name} onChange={v => update('name', v)} placeholder="Ej: Super Mario Bros" />
                </Field>

                <Field label="PRECIO">
                    <Input type="number" value={form.price.toString()} onChange={v => update('price', Number(v))} placeholder="0" />
                </Field>

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

                <Field label="CONSOLA">
                    <select
                        value={form.console ?? ''}
                        onChange={e => update('console', e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Seleccioná una consola</option>
                        {CONSOLES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </Field>

                <Field label="CATEGORÍA">
                    <select
                        value={form.categoryId ?? ''}
                        onChange={e => update('categoryId', e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Sin categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Field label="CONDICIÓN">
                        <select value={form.condition} onChange={e => update('condition', e.target.value)} style={selectStyle}>
                            <option value="sealed">Sellado</option>
                            <option value="like_new">Como nuevo</option>
                            <option value="good">Buen estado</option>
                            <option value="fair">Con detalles</option>
                        </select>
                    </Field>
                    <Field label="ESTADO">
                        <select value={form.status} onChange={e => update('status', e.target.value)} style={selectStyle}>
                            <option value="available">Disponible</option>
                            <option value="reserved">Reservado</option>
                            <option value="sold">Vendido</option>
                        </select>
                    </Field>
                </div>

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

                <Field label="ETIQUETAS">
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {['offer', 'featured', 'new', 'slider'].map(tag => {
                            const active = form.tags.includes(tag)
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

                {/* Imágenes */}
                <Field label="IMÁGENES (máx. 4)">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                        {/* Preview imágenes actuales */}
                        {form.images.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {form.images.map((url, i) => (
                                    <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                                        <img
                                            src={url}
                                            alt={`Imagen ${i + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                        />
                                        <button
                                            onClick={async () => {
                                                await deleteImage(url)
                                                update('images', form.images.filter((_, idx) => idx !== i))
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                width: 22,
                                                height: 22,
                                                borderRadius: '50%',
                                                background: '#ff4444',
                                                border: 'none',
                                                color: '#fff',
                                                fontSize: '0.7rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Botón para subir */}
                        {form.images.length < 4 && (
                            <label
                                style={{
                                    border: '2px dashed rgba(255,255,255,0.1)',
                                    borderRadius: 12,
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    opacity: uploading ? 0.6 : 1,
                                    transition: 'border-color 0.2s',
                                    display: 'block',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={async e => {
                                        const files = Array.from(e.target.files ?? [])
                                        if (!files.length) return
                                        setUploading(true)
                                        try {
                                            const urls = await Promise.all(
                                                files.slice(0, 4 - form.images.length).map(f => uploadImage(f, 'products'))
                                            )
                                            update('images', [...form.images, ...urls])
                                        } catch (err) {
                                            console.error(err)
                                            alert('Error al subir imagen')
                                        } finally {
                                            setUploading(false)
                                        }
                                    }}
                                />
                                <p style={{
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.85rem',
                                    color: 'rgba(255,255,255,0.3)',
                                }}>
                                    {uploading ? 'Subiendo...' : '+ Subir imágenes'}
                                </p>
                                <p style={{
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.72rem',
                                    color: 'rgba(255,255,255,0.15)',
                                    marginTop: 4,
                                }}>
                                    JPG, PNG o WEBP — máx. {4 - form.images.length} más
                                </p>
                            </label>
                        )}
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
                            onClick={handleDelete}
                            disabled={deleting}
                            style={{
                                padding: '13px 20px',
                                background: 'none',
                                border: '1px solid rgba(255,0,0,0.3)',
                                borderRadius: 8,
                                fontFamily: 'var(--font-dm-sans)',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: 'rgba(255,80,80,0.7)',
                                cursor: deleting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            {deleting ? 'Eliminando...' : 'Eliminar'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

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