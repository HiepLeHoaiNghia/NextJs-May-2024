import { recoilPersist } from 'recoil-persist'

const { persistAtom: persistUser } = recoilPersist({
  key: 'user',
  storage: localStorage,
})

const { persistAtom: persistSystem } = recoilPersist({
  key: 'vite-ui-system',
  storage: localStorage,
})

export { persistSystem, persistUser }
