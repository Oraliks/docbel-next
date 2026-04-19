import { z } from 'zod'

export const PostStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'])

export const PostSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  status: PostStatusEnum.default('DRAFT'),
  categoryId: z.string().cuid().nullable().optional(),
  featuredImage: z.string().url().nullable().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),

  titleFr: z.string().min(1, 'Title (FR) required'),
  titleNl: z.string().min(1),
  titleDe: z.string().min(1),
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),

  bodyFr: z.string().default(''),
  bodyNl: z.string().default(''),
  bodyDe: z.string().default(''),
  bodyEn: z.string().default(''),
  bodyAr: z.string().default(''),

  excerptFr: z.string().nullable().optional(),
  excerptNl: z.string().nullable().optional(),
  excerptDe: z.string().nullable().optional(),
  excerptEn: z.string().nullable().optional(),
  excerptAr: z.string().nullable().optional(),

  metaTitleFr: z.string().nullable().optional(),
  metaTitleEn: z.string().nullable().optional(),
  metaDescFr: z.string().nullable().optional(),
  metaDescEn: z.string().nullable().optional(),

  tagIds: z.array(z.string().cuid()).optional(),
})

export const PostUpdateSchema = PostSchema.partial()

export type PostInput = z.infer<typeof PostSchema>
