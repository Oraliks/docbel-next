import { z } from 'zod'

export const CategorySchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  parentId: z.string().cuid().nullable().optional(),
  nameFr: z.string().min(1),
  nameNl: z.string().min(1),
  nameDe: z.string().min(1),
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  orderBy: z.number().int().default(0),
})

export const CategoryUpdateSchema = CategorySchema.partial()
export type CategoryInput = z.infer<typeof CategorySchema>
