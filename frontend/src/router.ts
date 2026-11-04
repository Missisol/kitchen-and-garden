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
    path: '/reserves',
    name: 'reserves',
    component: () => import('@/views/ReservesView.vue'),
  },
  {
    path: '/reserves/create',
    name: 'reserve-create',
    component: () => import('@/views/ReserveCreateView.vue'),
  },
  {
    path: '/reserves/:id/edit',
    name: 'reserve-update',
    component: () => import('@/views/ReserveUpdateView.vue'),
  },
]