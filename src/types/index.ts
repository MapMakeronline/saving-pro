// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  name: string
  currency: string
  language: string
  createdAt: string
  updatedAt: string
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  token: string
  user: User
}

// ─── Category ─────────────────────────────────────────────────────────────────
export type CategoryType = 'INCOME' | 'EXPENSE'

export interface Category {
  id: string
  name: string
  type: CategoryType
  color: string
  icon: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  type: CategoryType
  color?: string
  icon?: string
}

export interface UpdateCategoryDto {
  name?: string
  type?: CategoryType
  color?: string
  icon?: string
}

// ─── Transaction ──────────────────────────────────────────────────────────────
export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  description: string
  date: string
  categoryId: string
  userId: string
  category?: Category
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionDto {
  amount: number
  type: TransactionType
  description: string
  date: string
  categoryId: string
}

export interface UpdateTransactionDto {
  amount?: number
  type?: TransactionType
  description?: string
  date?: string
  categoryId?: string
}

export interface TransactionFilters {
  type?: TransactionType
  categoryId?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface PaginatedTransactions {
  data: Transaction[]
  total: number
  page: number
  totalPages: number
}

// ─── Budget ───────────────────────────────────────────────────────────────────
export interface Budget {
  id: string
  name: string
  amount: number
  spent: number
  period: string
  categoryId: string
  userId: string
  category?: Category
  createdAt: string
  updatedAt: string
}

export interface CreateBudgetDto {
  name: string
  amount: number
  period: string
  categoryId: string
}

export interface UpdateBudgetDto {
  name?: string
  amount?: number
  period?: string
  categoryId?: string
}

// ─── Goal ─────────────────────────────────────────────────────────────────────
export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateGoalDto {
  name: string
  targetAmount: number
  currentAmount?: number
  deadline: string
}

export interface UpdateGoalDto {
  name?: string
  targetAmount?: number
  currentAmount?: number
  deadline?: string
}

// ─── API Error ────────────────────────────────────────────────────────────────
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
