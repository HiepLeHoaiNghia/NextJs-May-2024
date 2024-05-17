import { atom } from 'recoil'

import { persistSystem } from '~/core/config/recoil/persist'

const languageState = atom<string>({
  key: 'language',
  default: 'en',
  effects_UNSTABLE: [persistSystem],
})

export default languageState
