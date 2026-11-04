
import type { MainMenu, Theme, LogoDataItem } from '@/@types/common'

export const mainMenu: MainMenu[] = [
  {
    name: 'Рецепты',
    path: '/recipes',
  },
  {
    name: 'Сад',
    path: '/garden',
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
    text: 'Кухня и сад',
  },
  {
    routeName: 'recipes',
    text: 'Кухня',
  },
  {
    routeName: 'garden',
    text: 'Сад',
  },
]