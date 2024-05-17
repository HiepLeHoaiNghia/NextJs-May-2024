import { z } from 'zod'

import { baseSchema } from './base.schema'

export const EditRequestSchema = baseSchema.pick({ status: true })

export type TEditRequestSchema = z.infer<typeof EditRequestSchema>
