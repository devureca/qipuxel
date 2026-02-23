'use client'

import { useState } from 'react'
import type { StoreConfig } from '@/types'
import { mockConfig } from '@/lib/mockData'

export default function ConfiguracionPage() {
    const [config, setConfig] = useState<StoreConfig>(mockConfig)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    function update(key: keyof StoreConfig, value: string) {
        setConfig(prev => ({ ...prev, [key]: value }))
        setSaved(false)
    }

    async function handleSave() {
        setSaving(true)
        await new Promise(r => setTimeout(r, 800))
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div style={{ maxWidth: 720 }}>
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
                        CONFIGURACIÓN
                    </h1>
                    <p style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.4)',
                    }}>
                        Información y apariencia de tu tienda
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        background: saved ? 'rgba(74,222,128,0.15)' : '#fff',
                        color: saved ? '#4ade80' : '#111',
                        border: saved ? '1px solid rgba(74,222,128,0.3)' : 'none',
                        borderRadius: 8,
                        padding: '10px 20px',
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.6 : 1,
                        transition: 'all 0.3s',
                    }}
                >
                    {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar cambios'}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Sección: Identidad */}
                <Section title="Identidad">
                    <Field label="NOMBRE DE LA TIENDA">
                        <Input value={config.name} onChange={v => update('name', v)} placeholder="Ej: RetroVerse" />
                    </Field>
                    <Field label="TAGLINE">
                        <Input value={config.tagline ?? ''} onChange={v => update('tagline', v)} placeholder="Ej: Videojuegos retro y coleccionables" />
                    </Field>
                </Section>

                {/* Sección: Apariencia */}
                <Section title="Apariencia">
                    <Field label="COLOR PRINCIPAL">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="color"
                                value={config.primaryColor}
                                onChange={e => update('primaryColor', e.target.value)}
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 8,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'none',
                                    cursor: 'pointer',
                                    padding: 4,
                                }}
                            />
                            <Input
                                value={config.primaryColor}
                                onChange={v => update('primaryColor', v)}
                                placeholder="#E63946"
                            />
                        </div>
                    </Field>
                </Section>

                {/* Sección: Contacto */}
                <Section title="Contacto">
                    <Field label="WHATSAPP (solo números con código de país)">
                        <Input
                            value={config.whatsapp ?? ''}
                            onChange={v => update('whatsapp', v)}
                            placeholder="5491123456789"
                        />
                    </Field>
                    <Field label="TELÉFONO">
                        <Input
                            value={config.phone ?? ''}
                            onChange={v => update('phone', v)}
                            placeholder="011 1234-5678"
                        />
                    </Field>
                </Section>

                {/* Sección: Redes sociales */}
                <Section title="Redes sociales">
                    <Field label="INSTAGRAM">
                        <Input
                            value={config.instagram ?? ''}
                            onChange={v => update('instagram', v)}
                            placeholder="https://instagram.com/tutienda"
                        />
                    </Field>
                    <Field label="FACEBOOK">
                        <Input
                            value={config.facebook ?? ''}
                            onChange={v => update('facebook', v)}
                            placeholder="https://facebook.com/tutienda"
                        />
                    </Field>
                    <Field label="TIKTOK">
                        <Input
                            value={config.tiktok ?? ''}
                            onChange={v => update('tiktok', v)}
                            placeholder="https://tiktok.com/@tutienda"
                        />
                    </Field>
                </Section>

            </div>
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: '1.5rem',
        }}>
            <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
            }}>
                {title}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {children}
            </div>
        </div>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.35)',
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

function Input({ value, onChange, placeholder }: {
    value: string
    onChange: (v: string) => void
    placeholder?: string
}) {
    return (
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                width: '100%',
                background: '#0a0a0a',
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