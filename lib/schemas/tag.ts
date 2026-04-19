import { z } from 'zod'

export const TagSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  nameFr: z.string().min(1),
  nameNl: z.string().min(1),
  nameDe: z.string().min(1),
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
})

export const TagUpdateSchema = TagSchema.partial()
export type TagInput = z.infer<typeof TagSchema>
