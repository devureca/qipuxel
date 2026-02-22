'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function Home() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const test = async () => {
      try {
        await getDocs(collection(db, 'test'))
        setStatus('success')
      } catch (error) {
        console.error(error)
        setStatus('error')
      }
    }
    test()
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {status === 'loading' && <p>Conectando con Firebase...</p>}
      {status === 'success' && <p style={{ color: 'green' }}>✅ Firebase conectado correctamente</p>}
      {status === 'error' && <p style={{ color: 'red' }}>❌ Error conectando con Firebase</p>}
    </div>
  )
}