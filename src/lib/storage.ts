import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { app } from './firebase'

export const storage = getStorage(app)

export async function uploadImage(file: File, folder: string): Promise<string> {
    const ext = file.name.split('.').pop()
    const filename = `${folder}/${Date.now()}.${ext}`
    const storageRef = ref(storage, filename)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
}

export async function deleteImage(url: string): Promise<void> {
    try {
        const storageRef = ref(storage, url)
        await deleteObject(storageRef)
    } catch (err) {
        console.error('Error eliminando imagen:', err)
    }
}