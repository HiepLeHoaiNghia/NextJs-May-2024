import { atom } from 'recoil'

import { persistSystem } from '~/core/config/recoil/persist'
import { THEME } from '~/core/constants'

const themeState = atom<(typeof THEME)[keyof typeof THEME]>({
  key: 'theme',
  default: THEME.SYSTEM,
  effects_UNSTABLE: [persistSystem],
})

export default themeState
