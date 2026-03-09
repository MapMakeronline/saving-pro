import { create } from 'zustand'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types'
import { categoryService } from '../services/categoryService'
import { useToastStore } from './toastStore'

interface CategoryState {
  categories: Category[]
  isLoading: boolean
  error: string | null

  fetchCategories: () => Promise<void>
  createCategory: (dto: CreateCategoryDto) => Promise<void>
  updateCategory: (id: string, dto: UpdateCategoryDto) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null })
    try {
      const categories = await categoryService.getAll()
      set({ categories, isLoading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Błąd pobierania kategorii'
      set({ error: message, isLoading: false })
    }
  },

  createCategory: async (dto) => {
    const newCat = await categoryService.create(dto)
    set((state) => ({ categories: [...state.categories, newCat] }))
    useToastStore.getState().success('Kategoria dodana!')
  },

  updateCategory: async (id, dto) => {
    const updated = await categoryService.update(id, dto)
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? updated : c)),
    }))
    useToastStore.getState().success('Kategoria zaktualizowana!')
  },

  deleteCategory: async (id) => {
    await categoryService.delete(id)
    set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }))
    useToastStore.getState().success('Kategoria usunięta!')
  },
}))
