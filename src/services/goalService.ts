import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { Goal, CreateGoalDto, UpdateGoalDto } from '../types'

function uid(): string {
  const id = auth.currentUser?.uid
  if (!id) throw new Error('Nie zalogowany')
  return id
}

export const goalService = {
  async getAll(): Promise<Goal[]> {
    const snap = await getDocs(collection(db, 'users', uid(), 'goals'))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Goal))
  },

  async getById(id: string): Promise<Goal> {
    const snap = await getDoc(doc(db, 'users', uid(), 'goals', id))
    if (!snap.exists()) throw new Error('Nie znaleziono celu')
    return { id: snap.id, ...snap.data() } as Goal
  },

  async create(dto: CreateGoalDto): Promise<Goal> {
    const userId = uid()
    const now = new Date().toISOString()
    const data = { ...dto, userId, currentAmount: dto.currentAmount || 0, createdAt: now, updatedAt: now }
    const ref = await addDoc(collection(db, 'users', userId, 'goals'), data)
    return { id: ref.id, ...data } as Goal
  },

  async update(id: string, dto: UpdateGoalDto): Promise<Goal> {
    await updateDoc(doc(db, 'users', uid(), 'goals', id), { ...dto, updatedAt: new Date().toISOString() })
    return this.getById(id)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid(), 'goals', id))
  },
}
