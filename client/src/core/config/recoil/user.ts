import { atom } from 'recoil'

import { persistUser } from '~/core/config/recoil/persist'

const userState = atom({
  key: 'user',
  default: null,
  effects_UNSTABLE: [persistUser],
})

export default userState
