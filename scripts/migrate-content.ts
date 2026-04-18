#!/usr/bin/env node
/**
 * Migration script: Move all hardcoded content from lib/content.ts and lib/glossary.ts
 * into PostgreSQL database via Prisma ORM.
 *
 * Usage: npx tsx scripts/migrate-content.ts
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from .env.local FIRST
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

// NOW import everything else that depends on env vars
import type { FullLang } from '../lib/i18n.js'
import { prisma } from '../lib/prisma.js'

// Import hardcoded content
import {
  FAQ_CONTENT,
  REFORM_CHANGES,
  REFORM_PROFILES,
  REFORM_TIMELINE,
  NEWS_ITEMS,
  TOOLS_ITEMS,
  type FAQGroup,
  type Change,
  type Profile,
  type TLItem,
  type NewsItem,
  type ToolItem,
} from '../lib/content.js'
// Note: We'll call getGlossary('fr') to get all glossary data
import { getGlossary, type GlossaryEntry as GlossaryEntryType } from '../lib/glossary.js'

const LANGUAGES: FullLang[] = ['fr', 'nl', 'de', 'en', 'ar']

async function main() {
  console.log('🚀 Starting content migration...\n')

  try {
    // Verify no existing data (optional safety check)
    const faqCategoryCount = await prisma.faqCategory.count()
    const faqItemCount = await prisma.faqItem.count()
    const glossaryCount = await prisma.glossaryEntry.count()
    const newsCount = await prisma.newsItem.count()
    const reformChangeCount = await prisma.reformChange.count()
    const reformProfileCount = await prisma.reformProfile.count()
    const reformTimelineCount = await prisma.reformTimeline.count()
    const toolCount = await prisma.toolItem.count()

    const totalExisting =
      faqCategoryCount +
      faqItemCount +
      glossaryCount +
      newsCount +
      reformChangeCount +
      reformProfileCount +
      reformTimelineCount +
      toolCount

    if (totalExisting > 0) {
      console.warn('⚠️  Warning: Database already contains', totalExisting, 'records.')
      console.warn('   Delete existing data before migration.')
      process.exit(1)
    }

    // 1. Migrate FAQ content
    console.log('📚 Migrating FAQ content...')
    await migrateFAQ()
    console.log('✅ FAQ migration complete\n')

    // 2. Migrate glossary entries
    console.log('📖 Migrating glossary entries...')
    await migrateGlossary()
    console.log('✅ Glossary migration complete\n')

    // 3. Migrate news items
    console.log('📰 Migrating news items...')
    await migrateNews()
    console.log('✅ News migration complete\n')

    // 4. Migrate reform data
    console.log('⚡ Migrating reform data...')
    await migrateReforms()
    console.log('✅ Reform migration complete\n')

    // 5. Migrate tools
    console.log('🛠️  Migrating tools...')
    await migrateTools()
    console.log('✅ Tools migration complete\n')

    // Print summary
    const finalCategoryCount = await prisma.faqCategory.count()
    const finalItemCount = await prisma.faqItem.count()
    const finalGlossaryCount = await prisma.glossaryEntry.count()
    const finalNewsCount = await prisma.newsItem.count()
    const finalReformChangeCount = await prisma.reformChange.count()
    const finalReformProfileCount = await prisma.reformProfile.count()
    const finalReformTimelineCount = await prisma.reformTimeline.count()
    const finalToolCount = await prisma.toolItem.count()

    console.log('═══════════════════════════════════════════════════════════')
    console.log('📊 Migration Summary:')
    console.log('═══════════════════════════════════════════════════════════')
    console.log(`  FAQ Categories:        ${finalCategoryCount}`)
    console.log(`  FAQ Items:             ${finalItemCount}`)
    console.log(`  Glossary Entries:      ${finalGlossaryCount}`)
    console.log(`  News Items:            ${finalNewsCount}`)
    console.log(`  Reform Changes:        ${finalReformChangeCount}`)
    console.log(`  Reform Profiles:       ${finalReformProfileCount}`)
    console.log(`  Reform Timeline Items: ${finalReformTimelineCount}`)
    console.log(`  Tools:                 ${finalToolCount}`)
    console.log('═══════════════════════════════════════════════════════════')
    console.log('✨ Migration completed successfully!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function migrateFAQ() {
  // Get all language variants
  const langData = FAQ_CONTENT as Record<FullLang, FAQGroup[]>

  // Process categories from FR (structure is same for all languages)
  const frGroups = langData.fr

  for (let categoryIndex = 0; categoryIndex < frGroups.length; categoryIndex++) {
    const frGroup = frGroups[categoryIndex]

    // Get corresponding groups from other languages
    const nlGroup = langData.nl[categoryIndex]
    const deGroup = langData.de[categoryIndex]
    const enGroup = langData.en[categoryIndex]
    const arGroup = langData.ar[categoryIndex]

    // Create category with all language translations
    const category = await prisma.faqCategory.create({
      data: {
        id: frGroup.id,
        orderBy: categoryIndex,
        nameFr: frGroup.label,
        nameNl: nlGroup?.label || frGroup.label,
        nameDe: deGroup?.label || frGroup.label,
        nameEn: enGroup?.label || frGroup.label,
        nameAr: arGroup?.label || frGroup.label,
      },
    })

    // Create items
    for (let itemIndex = 0; itemIndex < frGroup.items.length; itemIndex++) {
      const frItem = frGroup.items[itemIndex]
      const nlItem = nlGroup?.items[itemIndex]
      const deItem = deGroup?.items[itemIndex]
      const enItem = enGroup?.items[itemIndex]
      const arItem = arGroup?.items[itemIndex]

      // Convert answer blocks to HTML
      const getAnswerHtml = (blocks: typeof frItem.a) =>
        blocks.map((block) => {
          if (block.type === 'info') {
            return `<div class="info-block">${block.html}</div>`
          }
          return `<p>${block.html}</p>`
        }).join('')

      await prisma.faqItem.create({
        data: {
          id: frItem.id,
          categoryId: category.id,
          orderBy: itemIndex,
          questionFr: frItem.q,
          questionNl: nlItem?.q || frItem.q,
          questionDe: deItem?.q || frItem.q,
          questionEn: enItem?.q || frItem.q,
          questionAr: arItem?.q || frItem.q,
          answerFr: getAnswerHtml(frItem.a),
          answerNl: nlItem ? getAnswerHtml(nlItem.a) : getAnswerHtml(frItem.a),
          answerDe: deItem ? getAnswerHtml(deItem.a) : getAnswerHtml(frItem.a),
          answerEn: enItem ? getAnswerHtml(enItem.a) : getAnswerHtml(frItem.a),
          answerAr: arItem ? getAnswerHtml(arItem.a) : getAnswerHtml(frItem.a),
        },
      })
    }

    console.log(`  ✓ Created category "${frGroup.label}" with ${frGroup.items.length} items`)
  }
}

async function migrateGlossary() {
  // Get all glossary entries (already includes all language data)
  const glossaryEntries: GlossaryEntryType[] = getGlossary('fr')

  for (let index = 0; index < glossaryEntries.length; index++) {
    const entry = glossaryEntries[index]

    await prisma.glossaryEntry.create({
      data: {
        id: entry.id,
        term: entry.term,
        orderBy: index,
        category: entry.category,
        shortFr: entry.short,
        shortNl: entry.short,
        shortDe: entry.short,
        shortEn: entry.short,
        shortAr: entry.short,
        longFr: entry.long,
        longNl: entry.long,
        longDe: entry.long,
        longEn: entry.long,
        longAr: entry.long,
      },
    })
  }

  console.log(`  ✓ Created ${glossaryEntries.length} glossary entries`)
}

async function migrateNews() {
  const newsItemsByLang: Record<FullLang, any[]> = NEWS_ITEMS

  // Create a unique map of articles by title to avoid duplicates across languages
  const processedSlugs = new Set<string>()
  let processedCount = 0

  for (const [lang, newsItems] of Object.entries(newsItemsByLang)) {
    for (const item of newsItems) {
      // Generate unique slug from title
      const baseSlug = item.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

      // If we've already processed this article in another language, skip
      if (processedSlugs.has(baseSlug)) {
        continue
      }

      processedSlugs.add(baseSlug)
      processedCount++

      // Use excerpt as body content since that's what we have
      await prisma.newsItem.create({
        data: {
          slug: baseSlug,
          orderBy: processedCount,
          titleFr: item.title,
          titleNl: item.title,
          titleDe: item.title,
          titleEn: item.title,
          titleAr: item.title,
          bodyFr: item.excerpt || item.title,
          bodyNl: item.excerpt || item.title,
          bodyDe: item.excerpt || item.title,
          bodyEn: item.excerpt || item.title,
          bodyAr: item.excerpt || item.title,
          tags: item.tag || '',
          featuredAt: item.featured ? new Date(item.date) : null,
        },
      })
    }
    break // Only process one language variant (same articles for all langs)
  }

  console.log(`  ✓ Created ${processedCount} news items`)
}

async function migrateReforms() {
  // Migrate reform changes
  for (const [lang, changes] of Object.entries(REFORM_CHANGES)) {
    for (let index = 0; index < changes.length; index++) {
      const change = changes[index]

      await prisma.reformChange.create({
        data: {
          orderBy: index,
          beforeFr: `${change.beforeLabel}: ${change.beforeVal}`,
          beforeNl: `${change.beforeLabel}: ${change.beforeVal}`,
          beforeDe: `${change.beforeLabel}: ${change.beforeVal}`,
          beforeEn: `${change.beforeLabel}: ${change.beforeVal}`,
          beforeAr: `${change.beforeLabel}: ${change.beforeVal}`,
          afterFr: `${change.afterLabel}: ${change.afterVal}`,
          afterNl: `${change.afterLabel}: ${change.afterVal}`,
          afterDe: `${change.afterLabel}: ${change.afterVal}`,
          afterEn: `${change.afterLabel}: ${change.afterVal}`,
          afterAr: `${change.afterLabel}: ${change.afterVal}`,
          impactTag: change.tag,
        },
      })
    }
    break
  }

  const changeCount = await prisma.reformChange.count()
  console.log(`  ✓ Created ${changeCount} reform changes`)

  // Migrate reform profiles
  for (const [lang, profiles] of Object.entries(REFORM_PROFILES)) {
    for (let index = 0; index < profiles.length; index++) {
      const profile = profiles[index]

      // Store rows as JSON string
      const rowsJson = JSON.stringify(profile.rows)

      await prisma.reformProfile.create({
        data: {
          id: profile.id,
          orderBy: index,
          nameFr: profile.label,
          nameNl: profile.label,
          nameDe: profile.label,
          nameEn: profile.label,
          nameAr: profile.label,
          descFr: profile.title,
          descNl: profile.title,
          descDe: profile.title,
          descEn: profile.title,
          descAr: profile.title,
          impactFr: rowsJson,
          impactNl: rowsJson,
          impactDe: rowsJson,
          impactEn: rowsJson,
          impactAr: rowsJson,
        },
      })
    }
    break
  }

  const profileCount = await prisma.reformProfile.count()
  console.log(`  ✓ Created ${profileCount} reform profiles`)

  // Migrate reform timeline
  for (const [lang, timelineItems] of Object.entries(REFORM_TIMELINE)) {
    for (let index = 0; index < timelineItems.length; index++) {
      const item = timelineItems[index]

      await prisma.reformTimeline.create({
        data: {
          orderBy: index,
          eventDate: new Date(item.date),
          descFr: item.desc,
          descNl: item.desc,
          descDe: item.desc,
          descEn: item.desc,
          descAr: item.desc,
        },
      })
    }
    break
  }

  const timelineCount = await prisma.reformTimeline.count()
  console.log(`  ✓ Created ${timelineCount} timeline events`)
}

async function migrateTools() {
  for (const [lang, tools] of Object.entries(TOOLS_ITEMS)) {
    for (let index = 0; index < tools.length; index++) {
      const tool = tools[index]

      // Generate slug from title
      const slug = tool.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

      await prisma.toolItem.create({
        data: {
          slug,
          orderBy: index,
          titleFr: tool.title,
          titleNl: tool.title,
          titleDe: tool.title,
          titleEn: tool.title,
          titleAr: tool.title,
          descFr: tool.desc,
          descNl: tool.desc,
          descDe: tool.desc,
          descEn: tool.desc,
          descAr: tool.desc,
          link: tool.href,
          ctaFr: tool.cta === 'calc' ? 'Calculer' : 'Utiliser',
          ctaNl: tool.cta === 'calc' ? 'Berekenen' : 'Gebruiken',
          ctaDe: tool.cta === 'calc' ? 'Berechnen' : 'Nutzen',
          ctaEn: tool.cta === 'calc' ? 'Calculate' : 'Use',
          ctaAr: 'استخدم',
        },
      })
    }
    break
  }

  const toolCount = await prisma.toolItem.count()
  console.log(`  ✓ Created ${toolCount} tools`)
}

// Run migration
main()
