import { create } from 'zustand'
import type { Transaction, CreateTransactionDto, UpdateTransactionDto, TransactionFilters } from '../types'
import { transactionService } from '../services/transactionService'
import { useToastStore } from './toastStore'

interface TransactionState {
  transactions: Transaction[]
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  error: string | null

  fetchTransactions: (filters?: TransactionFilters) => Promise<void>
  createTransaction: (dto: CreateTransactionDto) => Promise<void>
  updateTransaction: (id: string, dto: UpdateTransactionDto) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  fetchTransactions: async (filters) => {
    set({ isLoading: true, error: null })
    try {
      const result = await transactionService.getAll(filters)
      const transactions = Array.isArray(result) ? result : result.data || []
      set({
        transactions,
        total: Array.isArray(result) ? result.length : result.total ?? 0,
        page: Array.isArray(result) ? 1 : result.page ?? 1,
        totalPages: Array.isArray(result) ? 1 : result.totalPages ?? 1,
        isLoading: false,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Błąd pobierania transakcji'
      set({ error: message, isLoading: false })
    }
  },

  createTransaction: async (dto) => {
    const newTx = await transactionService.create(dto)
    set((state) => ({ transactions: [newTx, ...state.transactions] }))
    useToastStore.getState().success('Transakcja dodana!')
  },

  updateTransaction: async (id, dto) => {
    const updated = await transactionService.update(id, dto)
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? updated : t)),
    }))
    useToastStore.getState().success('Transakcja zaktualizowana!')
  },

  deleteTransaction: async (id) => {
    await transactionService.delete(id)
    set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) }))
    useToastStore.getState().success('Transakcja usunięta!')
  },
}))
