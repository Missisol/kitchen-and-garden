// Use environment variable for Docker, fallback to local development URL
export const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5002'

export const apiUrls = {
  categories: `${baseURL}/categories`,
  recipes: `${baseURL}/recipes`,
  recipe: `${baseURL}/recipe`,
  recipeFile: `${baseURL}/recipe/file`,
  filePath: `${baseURL}/static/uploads`,
}