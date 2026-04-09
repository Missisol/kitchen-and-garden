export interface MainMenu {
  name: string;
  path: string;
}

export type ThemeValue = 'light' | 'dark' | 'light dark'

export interface Theme {
  name: string;
  value: ThemeValue;
}

export interface LogoDataItem {
  routeName: string | string[];
  text: string;
}

// export interface LogoData {
//   [key: string]: LogoDataItem;
// }

