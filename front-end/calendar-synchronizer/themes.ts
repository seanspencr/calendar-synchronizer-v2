import { createV5Theme, defaultChildrenThemes } from '@tamagui/config/v5'
import { v5ComponentThemes } from '@tamagui/themes/v5'
import { yellow, yellowDark, red, redDark, green, greenDark } from '@tamagui/colors'

const darkPalette = ['hsla(0, 18%, 1%, 1)','hsla(0, 18%, 6%, 1)','hsla(0, 18%, 12%, 1)','hsla(0, 18%, 17%, 1)','hsla(0, 18%, 23%, 1)','hsla(0, 18%, 28%, 1)','hsla(0, 18%, 34%, 1)','hsla(0, 18%, 39%, 1)','hsla(0, 18%, 45%, 1)','hsla(0, 18%, 50%, 1)','hsla(0, 15%, 93%, 1)','hsla(0, 15%, 99%, 1)']
const lightPalette = ['hsla(0, 18%, 99%, 1)','hsla(0, 18%, 98%, 1)','hsla(0, 18%, 96%, 1)','hsla(0, 18%, 95%, 1)','hsla(0, 18%, 94%, 1)','hsla(0, 18%, 92%, 1)','hsla(0, 18%, 91%, 1)','hsla(0, 18%, 90%, 1)','hsla(0, 18%, 88%, 1)','hsla(0, 18%, 87%, 1)','hsla(0, 15%, 15%, 1)','hsla(0, 15%, 1%, 1)']

// Your custom accent color theme
const accentLight = {
  "accent1": "hsla(80, 50%, 43%, 1)",
  "accent2": "hsla(80, 50%, 45%, 1)",
  "accent3": "hsla(80, 50%, 48%, 1)",
  "accent4": "hsla(80, 50%, 50%, 1)",
  "accent5": "hsla(80, 50%, 53%, 1)",
  "accent6": "hsla(80, 50%, 55%, 1)",
  "accent7": "hsla(80, 50%, 58%, 1)",
  "accent8": "hsla(80, 50%, 60%, 1)",
  "accent9": "hsla(80, 50%, 63%, 1)",
  "accent10": "hsla(80, 50%, 65%, 1)",
  "accent11": "hsla(250, 50%, 95%, 1)",
  "accent12": "hsla(250, 50%, 95%, 1)"
}

const accentDark = {
  "accent1": "hsla(80, 50%, 35%, 1)",
  "accent2": "hsla(80, 50%, 38%, 1)",
  "accent3": "hsla(80, 50%, 41%, 1)",
  "accent4": "hsla(80, 50%, 43%, 1)",
  "accent5": "hsla(80, 50%, 46%, 1)",
  "accent6": "hsla(80, 50%, 49%, 1)",
  "accent7": "hsla(80, 50%, 52%, 1)",
  "accent8": "hsla(80, 50%, 54%, 1)",
  "accent9": "hsla(80, 50%, 57%, 1)",
  "accent10": "hsla(80, 50%, 60%, 1)",
  "accent11": "hsla(250, 50%, 90%, 1)",
  "accent12": "hsla(250, 50%, 95%, 1)"
}

const builtThemes = createV5Theme({
  darkPalette,
  lightPalette,
  componentThemes: v5ComponentThemes,
  accent: {
    light: accentLight,
    dark: accentDark,
  },
  childrenThemes: {
    // Include default color themes (blue, red, green, yellow, etc.)
    ...defaultChildrenThemes,

    // Semantic color themes for warnings, errors, and success states
    warning: {
      light: yellow,
      dark: yellowDark,
    },
    error: {
      light: red,
      dark: redDark,
    },
    success: {
      light: green,
      dark: greenDark,
    },
  },
})

export type Themes = typeof builtThemes

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' &&
  process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)
