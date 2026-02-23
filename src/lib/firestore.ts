import {
    getFirestore,
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    orderBy,
    query,
    type DocumentData,
} from 'firebase/firestore'
import { app } from './firebase'

export const db = getFirestore(app)

// ---- PRODUCTOS ----
export async function getProducts() {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getProduct(id: string) {
    const snap = await getDoc(doc(db, 'products', id))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() }
}

export async function createProduct(data: DocumentData) {
    return await addDoc(collection(db, 'products'), {
        ...data,
        createdAt: new Date().toISOString(),
    })
}

export async function updateProduct(id: string, data: Partial<DocumentData>) {
    await updateDoc(doc(db, 'products', id), data)
}

export async function deleteProduct(id: string) {
    await deleteDoc(doc(db, 'products', id))
}

// ---- CATEGORÍAS ----
export async function getCategories() {
    const q = query(collection(db, 'categories'), orderBy('order'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createCategory(data: DocumentData) {
    return await addDoc(collection(db, 'categories'), data)
}

export async function updateCategory(id: string, data: Partial<DocumentData>) {
    await updateDoc(doc(db, 'categories', id), data)
}

export async function deleteCategory(id: string) {
    await deleteDoc(doc(db, 'categories', id))
}

// ---- SLIDER ----
export async function getSlides() {
    const q = query(collection(db, 'slides'), orderBy('order'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createSlide(data: DocumentData) {
    return await addDoc(collection(db, 'slides'), data)
}

export async function updateSlide(id: string, data: Partial<DocumentData>) {
    await updateDoc(doc(db, 'slides', id), data)
}

export async function deleteSlide(id: string) {
    await deleteDoc(doc(db, 'slides', id))
}

// ---- RESEÑAS ----
export async function getReviews() {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateReview(id: string, data: Partial<DocumentData>) {
    await updateDoc(doc(db, 'reviews', id), data)
}

export async function deleteReview(id: string) {
    await deleteDoc(doc(db, 'reviews', id))
}

// ---- MARCAS ----
export async function getBrands() {
    const snap = await getDocs(collection(db, 'brands'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createBrand(data: DocumentData) {
    return await addDoc(collection(db, 'brands'), data)
}

export async function deleteBrand(id: string) {
    await deleteDoc(doc(db, 'brands', id))
}

// ---- CONFIG ----
export async function getConfig() {
    const snap = await getDoc(doc(db, 'config', 'store'))
    if (!snap.exists()) return null
    return snap.data()
}

export async function updateConfig(data: Partial<DocumentData>) {
    await setDoc(doc(db, 'config', 'store'), data, { merge: true })
}