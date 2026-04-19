import { z } from 'zod'

export const UserRoleEnum = z.enum(['ADMIN', 'EDITOR', 'AUTHOR'])

export const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: UserRoleEnum.default('AUTHOR'),
  password: z.string().min(8).optional(),
})

export const UserUpdateSchema = UserSchema.partial()
export type UserInput = z.infer<typeof UserSchema>
