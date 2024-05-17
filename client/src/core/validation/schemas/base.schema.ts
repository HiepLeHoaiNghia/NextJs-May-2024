import { z } from 'zod'

import { isValidDateString } from '~/core/utils/date.util'

export const baseSchema = z.object({
  email: z
    .string()
    .email('Email không hợp lệ.')
    .min(1, { message: 'Email phải có ít nhất 1 ký tự.' })
    .max(40, { message: 'Email không được vượt quá 40 ký tự.' })
    .trim(),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
    .max(40, { message: 'Mật khẩu không được vượt quá 40 ký tự.' })
    .refine(
      (value) => {
        const specialChars = /[^A-Za-z0-9]/
        return specialChars.test(value)
      },
      { message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.' },
    )
    .refine((value) => value.trim() === value, {
      message: 'Mật khẩu không được chứa khoảng trắng ở đầu hoặc cuối.',
    }),
  oldPassword: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
    .max(40, { message: 'Mật khẩu không được vượt quá 40 ký tự.' })
    .refine(
      (value) => {
        const specialChars = /[^A-Za-z0-9]/
        return specialChars.test(value)
      },
      { message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.' },
    )
    .refine((value) => value.trim() === value, {
      message: 'Mật khẩu không được chứa khoảng trắng ở đầu hoặc cuối.',
    }),
  newPassword: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
    .max(40, { message: 'Mật khẩu không được vượt quá 40 ký tự.' })
    .refine(
      (value) => {
        const specialChars = /[^A-Za-z0-9]/
        return specialChars.test(value)
      },
      { message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.' },
    )
    .refine((value) => value.trim() === value, {
      message: 'Mật khẩu không được chứa khoảng trắng ở đầu hoặc cuối.',
    }),
  confirmPassword: z.string(),
  fullName: z.string().min(1, 'First name is required.'),
  age: z.string().regex(/^\d+$/).max(3).min(1, 'Age is required.'),
  avatar: z.string().optional(),
  gender: z.number().min(0).max(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  district: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  position: z.string().min(1),
  companyId: z.number(),
  status: z.number().min(0).max(2),
  lang: z.string(),
  roleId: z.number(),
  workStartDate: z
    .string()
    .refine((value) => isValidDateString(value), 'Invalid work start date format or date is too far in the future'),
})
