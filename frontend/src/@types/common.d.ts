export interface MainMenu {
  name: string;
  path: string;
}

export type ThemeValue = 'light' | 'dark' | 'light dark'

export interface Theme {
  name: string;
  value: ThemeValue;
}

export type LogoVariant = 'primary' | 'secondary';

export interface LogoDataItem {
  routeName: string | string[];
  text: string;
  variant: LogoVariant;
  icon: string;
}

