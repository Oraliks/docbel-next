import { z } from 'zod'

export const MediaUpdateSchema = z.object({
  altFr: z.string().nullable().optional(),
  altEn: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  folder: z.string().default('/'),
})

export type MediaUpdateInput = z.infer<typeof MediaUpdateSchema>
