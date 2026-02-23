'use client'

import { useState } from 'react'
import Navbar from '@/components/store/Navbar'
import HeroSlider from '@/components/store/HeroSlider'
import ProductsGrid from '@/components/store/ProductsGrid'
import FeaturedSlider from '@/components/store/FeaturedSlider'
import Reviews from '@/components/store/Reviews'
import Footer from '@/components/store/Footer'
import WhatsAppButton from '@/components/store/WhatsAppButton'
import {
    mockConfig,
    mockCategories,
    mockProducts,
    mockSliders,
    mockReviews,
} from '@/lib/mockData'

export default function StorePage() {
    const [darkMode, setDarkMode] = useState(true)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    return (
        <div style={{ background: darkMode ? mockConfig.bgColor : '#fff', minHeight: '100vh' }}>

            <Navbar
                config={mockConfig}
                categories={mockCategories}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

            <div style={{ padding: '24px 22px 0 24px' }}>
                <HeroSlider
                    slides={mockSliders}
                    config={mockConfig}
                />
            </div>

            {/* Ofertas - solo aparece si hay productos con tag "offer" */}
            <ProductsGrid
                products={mockProducts}
                categories={mockCategories}
                config={mockConfig}
                darkMode={darkMode}
                activeCategory={null}
                setActiveCategory={setActiveCategory}
                title="Ofertas"
                label="No te lo pierdas"
                filterTag="offer"
                showFilters={false}
                limit={8}
            />

            {/* Destacados - solo aparece si hay productos con tag "featured" */}
            <FeaturedSlider
                products={mockProducts}
                config={mockConfig}
                darkMode={darkMode}
                title="Destacados"
                label="Lo mejor de la tienda"
                filterTag="featured"
            />

            {/* Catálogo completo con filtros */}
            <ProductsGrid
                products={mockProducts}
                categories={mockCategories}
                config={mockConfig}
                darkMode={darkMode}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                title="Catálogo"
                label="Todo el stock"
                showFilters={true}
            />

            <Reviews
                reviews={mockReviews}
                darkMode={darkMode}
                primaryColor={mockConfig.primaryColor}
            />

            <Footer
                config={mockConfig}
                categories={mockCategories}
                darkMode={darkMode}
            />

            <WhatsAppButton config={mockConfig} />
        </div>
    )
}