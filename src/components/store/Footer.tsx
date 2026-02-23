'use client'

import type { StoreConfig, Category } from '@/types'

interface FooterProps {
    config: StoreConfig
    categories: Category[]
    darkMode: boolean
}

export default function Footer({ config, categories, darkMode }: FooterProps) {
    const visibleCategories = categories
        .filter(cat => cat.visible)
        .sort((a, b) => a.order - b.order)

    const year = new Date().getFullYear()
    const bg = '#0d0d0d'
    const border = 'rgba(255,255,255,0.07)'
    const textMuted = 'rgba(255,255,255,0.45)'

    const pages = [
        { label: 'Inicio', href: '/' },
        { label: 'Catálogo', href: '/catalogo' },
        { label: 'Ofertas', href: '/ofertas' },
        { label: 'Novedades', href: '/novedades' },
        { label: 'Destacados', href: '/destacados' },
    ]

    const socials = [
        config.instagram && { label: 'Instagram', href: config.instagram, icon: <InstagramIcon /> },
        config.facebook && { label: 'Facebook', href: config.facebook, icon: <FacebookIcon /> },
        config.tiktok && { label: 'TikTok', href: config.tiktok, icon: <TikTokIcon /> },
        config.whatsapp && { label: 'WhatsApp', href: `https://wa.me/${config.whatsapp}`, icon: <WhatsAppIcon /> },
    ].filter(Boolean) as { label: string; href: string; icon: React.ReactNode }[]

    return (
        <footer style={{ background: bg, borderTop: `1px solid ${border}` }}>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 5% 0' }}>
                <div className="footer-grid">

                    {/* Brand */}
                    <div>
                        <div style={{
                            fontFamily: 'var(--font-bebas)',
                            fontSize: '2rem',
                            letterSpacing: '0.1em',
                            color: '#fff',
                            marginBottom: '0.75rem',
                        }}>
                            {config.name}
                        </div>
                        {config.tagline && (
                            <p style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                color: 'rgba(255,255,255,0.75)',
                                marginBottom: '0.5rem',
                            }}>
                                {config.tagline}
                            </p>
                        )}
                        <p style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.82rem',
                            color: textMuted,
                            lineHeight: 1.7,
                            maxWidth: 280,
                        }}>
                            Tu catálogo online de videojuegos y coleccionables. Encontrá lo que buscás y contactanos por WhatsApp.
                        </p>
                    </div>

                    {/* Categorías + Páginas */}
                    <div className="footer-links-grid" style={{ gridColumn: 'span 1' }}>
                        {/* Categorías */}
                        <div>
                            <p style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: '#fff',
                                marginBottom: '1.25rem',
                            }}>
                                Categorías
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {visibleCategories.map(cat => (
                                    <li key={cat.id}>
                                        <a
                                            href={`/catalogo?categoria=${cat.slug}`}
                                            style={{
                                                fontFamily: 'var(--font-dm-sans)',
                                                fontSize: '0.85rem',
                                                color: textMuted,
                                                textDecoration: 'none',
                                                transition: 'color 0.2s',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                            onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
                                        >
                                            {cat.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Páginas */}
                        <div>
                            <p style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: '#fff',
                                marginBottom: '1.25rem',
                            }}>
                                Páginas
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {pages.map(page => (
                                    <li key={page.href}>
                                        <a
                                            href={page.href}
                                            style={{
                                                fontFamily: 'var(--font-dm-sans)',
                                                fontSize: '0.85rem',
                                                color: textMuted,
                                                textDecoration: 'none',
                                                transition: 'color 0.2s',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                            onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
                                        >
                                            {page.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Social - horizontal en mobile */}
                    <div className="footer-social">
                        <p style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            color: '#fff',
                            marginBottom: '1.25rem',
                        }}>
                            Social
                        </p>
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1.5rem',
                        }}>
                            {socials.map(social => (
                                <li key={social.label}>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontFamily: 'var(--font-dm-sans)',
                                            fontSize: '0.85rem',
                                            color: textMuted,
                                            textDecoration: 'none',
                                            transition: 'color 0.2s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                        onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                                            {social.icon}
                                        </span>
                                        {social.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div style={{
                    borderTop: `1px solid ${border}`,
                    marginTop: '3rem',
                    padding: '1.5rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <p style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.25)',
                        textAlign: 'center',
                    }}>
                        © Copyright <strong style={{ color: 'rgba(255,255,255,0.45)' }}>{config.name}</strong> {year} | Powered by{' '}
                        <strong style={{ color: config.primaryColor }}>Qipuxel</strong>
                    </p>
                </div>
            </div>
        </footer>
    )
}

function InstagramIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
    )
}

function FacebookIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
    )
}

function TikTokIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
        </svg>
    )
}

function WhatsAppIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    )
}