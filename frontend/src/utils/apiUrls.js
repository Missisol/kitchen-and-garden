export const baseURL = import.meta.env.VITE_API_BASE_URL

export const apiUrls = {
  categories: `${baseURL}/categories`,
  recipes: `${baseURL}/recipes`,
  recipe: `${baseURL}/recipe`,
  recipeFile: `${baseURL}/recipe/file`,
  filePath: `${baseURL}/static/uploads`,
}