import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types'

function uid(): string {
  const id = auth.currentUser?.uid
  if (!id) throw new Error('Nie zalogowany')
  return id
}

function mapDoc(id: string, data: Record<string, unknown>): Category {
  return { id, ...data } as Category
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const snap = await getDocs(collection(db, 'users', uid(), 'categories'))
    return snap.docs.map((d) => mapDoc(d.id, d.data()))
  },

  async getById(id: string): Promise<Category> {
    const snap = await getDoc(doc(db, 'users', uid(), 'categories', id))
    if (!snap.exists()) throw new Error('Nie znaleziono kategorii')
    return mapDoc(snap.id, snap.data())
  },

  async create(dto: CreateCategoryDto): Promise<Category> {
    const userId = uid()
    const now = new Date().toISOString()
    const data = { ...dto, userId, color: dto.color || '#6366f1', icon: dto.icon || '📂', createdAt: now, updatedAt: now }
    const ref = await addDoc(collection(db, 'users', userId, 'categories'), data)
    return { id: ref.id, ...data }
  },

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    await updateDoc(doc(db, 'users', uid(), 'categories', id), { ...dto, updatedAt: new Date().toISOString() })
    return this.getById(id)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid(), 'categories', id))
  },
}
