import { atom } from 'recoil'

import { persistUser } from '~/core/config/recoil/persist'

const isLoggedIn = atom<boolean>({
  key: 'isLoggedInState',
  default: false,
  effects_UNSTABLE: [persistUser],
})

export default isLoggedIn
