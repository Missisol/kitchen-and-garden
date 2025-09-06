import HomeView from '@/views/HomeView.vue'
import PageView from '@/views/PageView.vue'
import RecipeView from '@/views/RecipeView.vue'
import RecipeCreateView from '@/views/RecipeCreateView.vue'
import RecipeUpdateView from '@/views/RecipeUpdateView.vue'


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
    path: '/recipes/create',
    name: 'recipe-create',
    component: RecipeCreateView,
  },
  {
    path: '/recipes/:id/edit',
    name: 'recipe-update',
    component: RecipeUpdateView,
  },
  {
    path: '/recipes/:id',
    name: 'recipe',
    component: RecipeView,
  },
]