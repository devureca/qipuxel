'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/store/Navbar'
import HeroSlider from '@/components/store/HeroSlider'
import ProductsGrid from '@/components/store/ProductsGrid'
import FeaturedSlider from '@/components/store/FeaturedSlider'
import Reviews from '@/components/store/Reviews'
import BrandsBanner from '@/components/store/BrandsBanner'
import Footer from '@/components/store/Footer'
import WhatsAppButton from '@/components/store/WhatsAppButton'
import { getConfig, getCategories, getProducts, getSlides, getReviews, getBrands } from '@/lib/firestore'
import { mockConfig, mockCategories, mockProducts, mockSliders, mockReviews, mockBrands } from '@/lib/mockData'
import type { StoreConfig, Category, Product, SliderBanner, Review } from '@/types'

export default function StorePage() {
    const [darkMode, setDarkMode] = useState(false)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    const [config, setConfig] = useState<StoreConfig>(mockConfig)
    const [categories, setCategories] = useState<Category[]>(mockCategories)
    const [products, setProducts] = useState<Product[]>(mockProducts)
    const [slides, setSlides] = useState<SliderBanner[]>(mockSliders)
    const [reviews, setReviews] = useState<Review[]>(mockReviews)
    const [brands, setBrands] = useState(mockBrands)

    useEffect(() => {
        async function loadData() {
            try {
                const [cfg, cats, prods, slds, revs, brds] = await Promise.all([
                    getConfig(),
                    getCategories(),
                    getProducts(),
                    getSlides(),
                    getReviews(),
                    getBrands(),
                ])
                if (cfg) setConfig(cfg as StoreConfig)
                if (cats.length) setCategories(cats as Category[])
                if (prods.length) setProducts(prods as Product[])
                if (slds.length) setSlides(slds as SliderBanner[])
                if (revs.length) setReviews(revs as Review[])
                if (brds.length) setBrands(brds as typeof mockBrands)
            } catch (err) {
                console.error('Error cargando datos:', err)
                // Si falla Firebase usa mockData como fallback
            }
        }
        loadData()
    }, [])

    return (
        <div style={{ background: darkMode ? config.bgColor : '#fff', minHeight: '100vh' }}>
            <Navbar
                config={config}
                categories={categories}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

            <div style={{ padding: '24px 22px 0 24px' }}>
                <HeroSlider slides={slides} config={config} />
            </div>

            <ProductsGrid
                products={products}
                categories={categories}
                config={config}
                darkMode={darkMode}
                activeCategory={null}
                setActiveCategory={setActiveCategory}
                title="Ofertas"
                label="No te lo pierdas"
                filterTag="offer"
                showFilters={false}
                limit={8}
            />

            <FeaturedSlider
                products={products}
                config={config}
                darkMode={darkMode}
                title="Destacados"
                label="Lo mejor de la tienda"
                filterTag="featured"
            />

            <ProductsGrid
                products={products}
                categories={categories}
                config={config}
                darkMode={darkMode}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                title="Catálogo"
                label="Todo el stock"
                showFilters={false}
                limit={8}
                showViewAll={true}
            />

            <Reviews
                reviews={reviews}
                darkMode={darkMode}
                primaryColor={config.primaryColor}
            />

            <BrandsBanner brands={brands} darkMode={darkMode} />

            <Footer config={config} categories={categories} darkMode={darkMode} />

            <WhatsAppButton config={config} />
        </div>
    )
}