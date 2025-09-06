import HomeView from '@/views/HomeView.vue'
import PageView from '@/views/PageView.vue'
import CreateRecipeView from '@/views/CreateRecipeView.vue'
import RecipeComponent from '@/views/RecipeView.vue'

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
    path: '/create-recipe',
    name: 'create-recipe',
    component: CreateRecipeView,
  },
  {
    path: '/recipes/:id',
    name: 'recipe',
    component: RecipeComponent,
  },
]