import { useColorScheme } from 'react-native'
import { ThemeModeEnum } from '@config/enums/theme.enum'
import { darkColors, lightColors } from 'src/theme/colors'

export const useTheme = () => {
  const scheme = useColorScheme()
  
  const colors = scheme === ThemeModeEnum.DARK ? darkColors : lightColors
  
  const isDark = scheme === ThemeModeEnum.DARK

  return {
    colors,
    isDark,
    spacing: (value: number) => value * 8, 
  }
}