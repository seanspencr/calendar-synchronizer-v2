import { config as defaultConfig } from '@tamagui/config'
import { themes } from './themes'
import { createTamagui } from 'tamagui'

const config = createTamagui({
  ...defaultConfig,
  themes,
})

export type AppConfig = typeof config

// declare module 'tamagui' {
//   interface TamaguiCustomConfig extends AppConfig {}
// }

export default config