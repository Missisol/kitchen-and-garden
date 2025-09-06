import HomeView from '@/views/HomeView.vue'
import PageView from '@/views/PageView.vue'
import RecipeFormView from '@/views/RecipeFormView.vue'
import RecipeView from '@/views/RecipeView.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: PageView,
  },
  {
    path: '/recipe-form',
    name: 'recipe-form',
    component: RecipeFormView,
  },
  {
    path: '/recipes/:id',
    name: 'recipe',
    component: RecipeView,
  },
]