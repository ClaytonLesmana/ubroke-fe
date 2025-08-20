/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#E5E7EB',
    textSecondary: '#6B7280',
    primary: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#374151',
    textSecondary: '#9CA3AF',
    primary: tintColorDark,
  },
};

// Extended Color Palette
export const AppColors = {
  // Primary Colors
  primary: {
    100: '#FBF5FF',
    200: '#D2C2FF',
    300: '#936DFF',
  },
  
  // Grayscale
  gray: {
    0: '#FFFFFF',
    100: '#F7F5FF',
    200: '#ECEDF3',
    300: '#B8B8B8',
    400: '#848484',
    500: '#1B1B1B',
  },
  
  // Yellow
  yellow: {
    0: '#FFFFE5',
    100: '#FEBA01',
  },
  
  // Green
  green: {
    0: '#EFFEFA',
    100: '#287F6E',
  },
  
  // Red
  red: {
    0: '#FDEDF0',
    100: '#DF1C41',
  },
  
  // Semantic Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Financial Colors
  income: '#4CAF50',
  expense: '#F44336',
  transfer: '#FF9800',
  savings: '#2196F3',
};

// Category Colors - for transaction categories
export const CategoryColors = {
  'Food & Drink': AppColors.red[100],
  'Transportation': AppColors.yellow[100],
  'Shopping': AppColors.primary[300],
  'Entertainment': AppColors.green[100],
  'Bills & Utilities': AppColors.gray[400],
  'Healthcare': AppColors.red[0],
  'Education': AppColors.primary[200],
  'Travel': AppColors.yellow[0],
  'Other': AppColors.gray[300],
};

// Helper functions to easily access colors
export const getColor = (colorPath: string): string => {
  const path = colorPath.split('.');
  let color: any = AppColors;
  
  for (const key of path) {
    color = color[key];
    if (!color) return AppColors.gray[300]; // fallback color
  }
  
  return color;
};

export const getCategoryColor = (category: string): string => {
  return CategoryColors[category as keyof typeof CategoryColors] || AppColors.gray[300];
};

export const getAmountColor = (amount: number): string => {
  return amount >= 0 ? AppColors.income : AppColors.expense;
};
