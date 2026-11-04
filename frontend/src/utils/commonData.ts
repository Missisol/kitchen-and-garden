
import type { MainMenu, Theme, LogoDataItem } from '@/@types/common'

export const mainMenu: MainMenu[] = [
  {
    name: 'Рецепты',
    path: '/recipes',
  },
  {
    name: 'Запасы',
    path: '/reserves',
  },
]

export const themes: Theme[] = [
  {name: 'Светлая', value: 'light'},
  {name: 'Темная', value: 'dark'},
  {name: 'Авто', value: 'light dark'}
]

export const logoData: LogoDataItem[] = [
  {
    routeName: 'home',
    text: 'Кухня и запасы',
  },
  {
    routeName: 'recipes',
    text: 'Кухня',
  },
  {
    routeName: 'reserves',
    text: 'Запасы',
  },
]