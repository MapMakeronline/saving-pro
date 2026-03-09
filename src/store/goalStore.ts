import { create } from 'zustand'
import type { Goal, CreateGoalDto, UpdateGoalDto } from '../types'
import { goalService } from '../services/goalService'
import { useToastStore } from './toastStore'

interface GoalState {
  goals: Goal[]
  isLoading: boolean
  error: string | null

  fetchGoals: () => Promise<void>
  createGoal: (dto: CreateGoalDto) => Promise<void>
  updateGoal: (id: string, dto: UpdateGoalDto) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null })
    try {
      const goals = await goalService.getAll()
      set({ goals, isLoading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Błąd pobierania celów'
      set({ error: message, isLoading: false })
    }
  },

  createGoal: async (dto) => {
    const newGoal = await goalService.create(dto)
    set((state) => ({ goals: [...state.goals, newGoal] }))
    useToastStore.getState().success('Cel dodany!')
  },

  updateGoal: async (id, dto) => {
    const updated = await goalService.update(id, dto)
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? updated : g)),
    }))
    useToastStore.getState().success('Cel zaktualizowany!')
  },

  deleteGoal: async (id) => {
    await goalService.delete(id)
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }))
    useToastStore.getState().success('Cel usunięty!')
  },
}))
