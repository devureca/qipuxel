// ── Tienda ──────────────────────────────────────────────
export interface StoreConfig {
    name: string
    logo: string | null
    primaryColor: string
    bgColor: string
    cardBg: string
    textColor: string
    headerBg: string
    footerBg: string
    whatsapp: string
    instagram: string | null
    facebook: string | null
    tiktok: string | null
    phone: string | null
    tagline: string | null
}

// ── Categorías ───────────────────────────────────────────
export interface Category {
    id: string
    name: string
    slug: string
    order: number
    visible: boolean
}

// ── Productos ────────────────────────────────────────────
export type ProductStatus = 'available' | 'sold' | 'reserved'
export type ProductCondition = 'sealed' | 'like_new' | 'good' | 'fair'

export interface Product {
    id: string
    name: string
    price: number
    description: string | null
    images: string[]
    categoryId: string
    console: string | null
    condition: ProductCondition
    complete: boolean
    region: string | null
    status: ProductStatus
    tags: ProductTag[]
    createdAt: Date
}

export type ProductTag = 'slider' | 'featured' | 'offer' | 'new'

// ── Slider ───────────────────────────────────────────────
export interface SliderBanner {
    id: string
    image: string
    order: number
    active: boolean
}

// ── Reseñas ──────────────────────────────────────────────
export interface Review {
    id: string
    name: string
    rating: 1 | 2 | 3 | 4 | 5
    text: string
    visible: boolean
    createdAt: Date
    date?: string
}

// ── Reservas (Plan Premium) ──────────────────────────────
export interface Reservation {
    id: string
    productId: string
    productName: string
    customerName: string
    customerPhone: string
    customerEmail: string | null
    deposit: number | null
    notes: string | null
    createdAt: Date
}

// ── Brand ───────────────────────────────────────────────
export interface Brand {
    id: string
    name: string
    logo: string | null
  }