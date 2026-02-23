'use client'

import { useState } from 'react'

interface Brand {
    id: string
    name: string
    logo: string | null
}

const mockBrandsData: Brand[] = [
    { id: '1', name: 'Nintendo', logo: null },
    { id: '2', name: 'PlayStation', logo: null },
    { id: '3', name: 'Xbox', logo: null },
    { id: '4', name: 'Sega', logo: null },
    { id: '5', name: 'Atari', logo: null },
]

export default function MarcasPage() {
    const [brands, setBrands] = useState<Brand[]>(mockBrandsData)
    const [newName, setNewName] = useState('')
    const [adding, setAdding] = useState(false)

    function addBrand() {
        if (!newName.trim()) return
        setBrands(prev => [...prev, {
            id: Date.now().toString(),
            name: newName.trim(),
            logo: null,
        }])
        setNewName('')
        setAdding(false)
    }

    function deleteBrand(id: string) {
        setBrands(prev => prev.filter(b => b.id !== id))
    }

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
                        MARCAS
                    </h1>
                    <p style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.4)',
                    }}>
                        {brands.length} marcas en el banner. Si no hay ninguna el banner no aparece.
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
                    + Agregar marca
                </button>
            </div>

            {/* Formulario nueva marca */}
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
                        placeholder="Nombre de la marca"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addBrand()}
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
                        onClick={addBrand}
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
                {brands.map(brand => (
                    <div
                        key={brand.id}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '48px 1fr auto',
                            alignItems: 'center',
                            gap: '1rem',
                            background: '#111',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 10,
                            padding: '0.875rem 1rem',
                        }}
                    >
                        {/* Logo o inicial */}
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: 8,
                            background: '#1a1a1a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                        }}>
                            {brand.logo ? (
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <span style={{
                                    fontFamily: 'var(--font-bebas)',
                                    fontSize: '1.2rem',
                                    color: 'rgba(255,255,255,0.3)',
                                }}>
                                    {brand.name.charAt(0)}
                                </span>
                            )}
                        </div>

                        {/* Nombre */}
                        <div>
                            <p style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: '#fff',
                                marginBottom: 2,
                            }}>
                                {brand.name}
                            </p>
                            <p style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: '0.72rem',
                                color: 'rgba(255,255,255,0.25)',
                            }}>
                                {brand.logo ? 'Logo subido' : 'Sin logo — se muestra el nombre'}
                            </p>
                        </div>

                        {/* Acciones */}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: 6,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'none',
                                    color: 'rgba(255,255,255,0.4)',
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.72rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = '#fff'
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                                }}
                            >
                                Subir logo
                            </button>

                            <button
                                onClick={() => deleteBrand(brand.id)}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: 6,
                                    border: '1px solid rgba(255,0,0,0.2)',
                                    background: 'none',
                                    color: 'rgba(255,80,80,0.5)',
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.72rem',
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