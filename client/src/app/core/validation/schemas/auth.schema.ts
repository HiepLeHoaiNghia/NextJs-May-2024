import { z } from 'zod'

import { baseSchema } from './base.schema'

export const LoginSchema = baseSchema.pick({ email: true, password: true })

export const ForgotPasswordSchema = baseSchema.pick({ email: true })

export const ChangePasswordSchema = baseSchema
  .pick({
    oldPassword: true,
    newPassword: true,
    confirmPassword: true,
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Mật khẩu không chính xác.',
    path: ['confirmPassword'],
  })

export const ResetPasswordSchema = baseSchema
  .pick({
    newPassword: true,
    confirmPassword: true,
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Mật khẩu không chính xác.',
    path: ['confirmPassword'],
  })

export type TLoginSchema = z.infer<typeof LoginSchema>
export type TForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>
export type TChangePasswordSchema = z.infer<typeof ChangePasswordSchema> & { token: string | null }
export type TResetPasswordSchema = z.infer<typeof ResetPasswordSchema> & { token: string | null }
