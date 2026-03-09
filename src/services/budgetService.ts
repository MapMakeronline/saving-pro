import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { Budget, CreateBudgetDto, UpdateBudgetDto } from '../types'

function uid(): string {
  const id = auth.currentUser?.uid
  if (!id) throw new Error('Nie zalogowany')
  return id
}

export const budgetService = {
  async getAll(): Promise<Budget[]> {
    const snap = await getDocs(collection(db, 'users', uid(), 'budgets'))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Budget))
  },

  async getById(id: string): Promise<Budget> {
    const snap = await getDoc(doc(db, 'users', uid(), 'budgets', id))
    if (!snap.exists()) throw new Error('Nie znaleziono budżetu')
    return { id: snap.id, ...snap.data() } as Budget
  },

  async create(dto: CreateBudgetDto): Promise<Budget> {
    const userId = uid()
    const now = new Date().toISOString()
    const data = { ...dto, userId, spent: 0, createdAt: now, updatedAt: now }
    const ref = await addDoc(collection(db, 'users', userId, 'budgets'), data)
    return { id: ref.id, ...data } as Budget
  },

  async update(id: string, dto: UpdateBudgetDto): Promise<Budget> {
    await updateDoc(doc(db, 'users', uid(), 'budgets', id), { ...dto, updatedAt: new Date().toISOString() })
    return this.getById(id)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid(), 'budgets', id))
  },
}
