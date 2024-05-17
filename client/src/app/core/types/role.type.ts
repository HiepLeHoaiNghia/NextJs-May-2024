import { ROLES } from '../constants'

export type TRole = (typeof ROLES)[keyof typeof ROLES]
