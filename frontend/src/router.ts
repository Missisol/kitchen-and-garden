export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: () => import('@/views/RecipesView.vue'),
  },
  {
    path: '/recipes/create',
    name: 'recipe-create',
    component: () => import('@/views/RecipeCreateView.vue'),
  },
  {
    path: '/recipes/:id/edit',
    name: 'recipe-update',
    component: () => import('@/views/RecipeUpdateView.vue'),
  },
  {
    path: '/recipes/:id',
    name: 'recipe',
    component: () => import('@/views/RecipeView.vue'),
  },
  {
    path: '/garden',
    name: 'garden',
    component: () => import('@/views/GardenView.vue'),
  },
]