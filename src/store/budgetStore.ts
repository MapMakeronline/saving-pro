import { create } from 'zustand'
import type { Budget, CreateBudgetDto, UpdateBudgetDto } from '../types'
import { budgetService } from '../services/budgetService'
import { useToastStore } from './toastStore'

interface BudgetState {
  budgets: Budget[]
  isLoading: boolean
  error: string | null

  fetchBudgets: () => Promise<void>
  createBudget: (dto: CreateBudgetDto) => Promise<void>
  updateBudget: (id: string, dto: UpdateBudgetDto) => Promise<void>
  deleteBudget: (id: string) => Promise<void>
}

export const useBudgetStore = create<BudgetState>((set) => ({
  budgets: [],
  isLoading: false,
  error: null,

  fetchBudgets: async () => {
    set({ isLoading: true, error: null })
    try {
      const budgets = await budgetService.getAll()
      set({ budgets, isLoading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Błąd pobierania budżetów'
      set({ error: message, isLoading: false })
    }
  },

  createBudget: async (dto) => {
    const newBudget = await budgetService.create(dto)
    set((state) => ({ budgets: [...state.budgets, newBudget] }))
    useToastStore.getState().success('Budżet dodany!')
  },

  updateBudget: async (id, dto) => {
    const updated = await budgetService.update(id, dto)
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === id ? updated : b)),
    }))
    useToastStore.getState().success('Budżet zaktualizowany!')
  },

  deleteBudget: async (id) => {
    await budgetService.delete(id)
    set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) }))
    useToastStore.getState().success('Budżet usunięty!')
  },
}))
