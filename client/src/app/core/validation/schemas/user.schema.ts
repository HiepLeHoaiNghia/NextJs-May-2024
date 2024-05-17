import { z } from 'zod'

import { baseSchema } from './base.schema'

export const ProfileSchema = baseSchema.pick({ fullName: true, email: true, age: true, avatar: true })

export const UserManagementSchema = baseSchema.pick({
  email: true,
  fullName: true,
  companyId: true,
  password: true,
  roleId: true,
  gender: true,
  phone: true,
  address: true,
  district: true,
  city: true,
  country: true,
  workStartDate: true,
  position: true,
  status: true,
  lang: true,
  avatar: true,
})

export type TProfileSchema = z.infer<typeof ProfileSchema>
export type TUserManagementSchema = z.infer<typeof UserManagementSchema>
