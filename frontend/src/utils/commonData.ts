
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
    variant: 'primary',
    icon: 'IconLogo',
  },
  {
    routeName: 'recipes',
    text: 'Кухня',
    variant: 'primary',
    icon: 'IconChefhat',
  },
  {
    routeName: ['reserves', 'reserve-create', 'reserve-update'],
    text: 'Запасы',
    variant: 'secondary',
    icon: 'IconSprout',
  },
]