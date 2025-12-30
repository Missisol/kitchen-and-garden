export interface Recipe {
  id: number
  title: string
  ingredients?: string
  instructions?: string
  links?: string
  comment?: string
  category_id?: number | string
  file?: string | null
  favorite?: boolean
  error?: unknown
}

export interface RecipeResponse {
  recipes?: Recipe[]
  total_pages?: number
  total_items?: number
  page?: number
  per_page?: number
}

