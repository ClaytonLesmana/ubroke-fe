import { scale } from './scale';

export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(24),
  xxl: scale(32),
};

export const radii = {
  sm: scale(8),
  md: scale(12),
  lg: scale(20),
  xl: scale(28),
  pill: scale(55),
};

export const typography = {
  title: scale(18),
  subtitle: scale(15),
  body: scale(14),
  caption: scale(12),
};

export const colors = {
  primary: '#936DFF',
  surface: '#FFFFFF',
  text: '#111',
  muted: '#9AA0A6',
  grayBg: '#F5F6F8',
};
