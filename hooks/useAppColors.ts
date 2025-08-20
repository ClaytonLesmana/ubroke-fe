import { useColorScheme } from './useColorScheme';
import { Colors, AppColors, getCategoryColor, getAmountColor } from '@/constants/Colors';

export const useAppColors = () => {
  const colorScheme = useColorScheme();
  
  return {
    // Theme colors
    theme: Colors[colorScheme ?? 'light'],
    
    // App color palette
    colors: AppColors,
    
    // Helper functions
    getCategoryColor,
    getAmountColor,
    
    // Quick access to common colors
    primary: AppColors.primary,
    gray: AppColors.gray,
    yellow: AppColors.yellow,
    green: AppColors.green,
    red: AppColors.red,
    
    // Semantic colors
    success: AppColors.success,
    warning: AppColors.warning,
    error: AppColors.error,
    info: AppColors.info,
  };
}; 