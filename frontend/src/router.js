import HomeView from '@/views/HomeView.vue'
import PageView from '@/views/PageView.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: PageView,
  },
  {
    path: '/create-recipe',
    name: 'create-recipe',
    component: () => import('@/views/CreateRecipeView.vue')
  },
]