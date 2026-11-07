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

const routeTitles: Record<string, string> = {
  'home': 'Кухня и запасы',
  'recipes': 'Рецепты',
  'recipe-create': 'Создать рецепт',
  'recipe-update': 'Редактировать рецепт',
  'recipe': 'Рецепт',
  'reserves': 'Запасы',
  'reserve-create': 'Создать запас',
  'reserve-update': 'Редактировать запас',
}

export function setDocumentTitle(routeName: string | symbol | null | undefined) {
  const title = routeName && routeTitles[String(routeName)]
  document.title = title ? `${title}` : 'Кухня и запасы'
}