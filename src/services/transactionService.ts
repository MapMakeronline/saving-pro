import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { Transaction, CreateTransactionDto, UpdateTransactionDto, TransactionFilters, PaginatedTransactions } from '../types'

function uid(): string {
  const id = auth.currentUser?.uid
  if (!id) throw new Error('Nie zalogowany')
  return id
}

export const transactionService = {
  async getAll(filters?: TransactionFilters): Promise<PaginatedTransactions> {
    const snap = await getDocs(collection(db, 'users', uid(), 'transactions'))
    let list: Transaction[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction))

    if (filters?.type) list = list.filter((t) => t.type === filters.type)
    if (filters?.categoryId) list = list.filter((t) => t.categoryId === filters.categoryId)
    if (filters?.startDate) list = list.filter((t) => t.date >= filters.startDate!)
    if (filters?.endDate) list = list.filter((t) => t.date <= filters.endDate!)

    list.sort((a, b) => b.date.localeCompare(a.date))

    const total = list.length
    const page = filters?.page || 1
    const pageSize = filters?.limit || 10
    const data = list.slice((page - 1) * pageSize, page * pageSize)

    return { data, total, page, totalPages: Math.ceil(total / pageSize) }
  },

  async getById(id: string): Promise<Transaction> {
    const snap = await getDoc(doc(db, 'users', uid(), 'transactions', id))
    if (!snap.exists()) throw new Error('Nie znaleziono transakcji')
    return { id: snap.id, ...snap.data() } as Transaction
  },

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const userId = uid()
    const now = new Date().toISOString()
    const data = { ...dto, userId, createdAt: now, updatedAt: now }
    const ref = await addDoc(collection(db, 'users', userId, 'transactions'), data)
    return { id: ref.id, ...data } as Transaction
  },

  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    await updateDoc(doc(db, 'users', uid(), 'transactions', id), { ...dto, updatedAt: new Date().toISOString() })
    return this.getById(id)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid(), 'transactions', id))
  },
}
