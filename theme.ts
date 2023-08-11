
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

// extend the theme
const theme = extendTheme({ config })

export default theme