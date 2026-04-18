# Content Migration Guide

## Phase 6: Content Migration to PostgreSQL

This document describes how to migrate all hardcoded content from TypeScript files to the PostgreSQL database.

## Overview

The DocBel application previously stored all content (FAQ, news, reforms, tools, glossary) as hardcoded TypeScript objects in:
- `lib/content.ts` (857 lines)
- `lib/glossary.ts` (162 lines)
- `lib/i18n.ts` (996 lines)

**Phase 6** migrates this static content to a PostgreSQL database using Prisma ORM, enabling dynamic content management through the admin panel.

## What Gets Migrated

| Content Type | Source | Count | Database Table |
|---|---|---|---|
| FAQ Categories | `lib/content.ts` | 5 | `FaqCategory` |
| FAQ Items | `lib/content.ts` | 18 | `FaqItem` |
| News Articles | `lib/content.ts` | 5 | `NewsItem` |
| Reform Changes | `lib/content.ts` | 6 | `ReformChange` |
| Reform Profiles | `lib/content.ts` | 4 | `ReformProfile` |
| Reform Timeline Events | `lib/content.ts` | 6 | `ReformTimeline` |
| Tools/Calculators | `lib/content.ts` | 8 | `ToolItem` |
| Glossary Entries | `lib/glossary.ts` | 20 | `GlossaryEntry` |
| **TOTAL** | — | **72** | — |

## Prerequisites

1. **PostgreSQL database running** (local or via Neon/similar service)
2. **Environment variables configured** (`.env.local`)
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database"
   SESSION_SECRET="your-secret-key"
   ```
3. **Prisma schema created** (`prisma/schema.prisma`)
4. **Database migrations applied** (`npx prisma migrate dev --name init`)

## Running the Migration

### 1. Generate Prisma Client (if not already done)
```bash
npm run prisma:generate
```

### 2. Apply database schema
```bash
npm run prisma:migrate
```

### 3. Run the migration script
```bash
npm run migrate
```

Or manually:
```bash
node --import dotenv/config --import tsx scripts/migrate-content.ts
```

## What the Migration Script Does

1. **Validates database** — Checks that the database is empty (no existing records)
2. **Migrates FAQ** — Creates 5 categories with 18 items, each with 5-language translations
3. **Migrates glossary** — Creates 20 legal terms with short/long definitions in all languages
4. **Migrates news** — Creates 5 news articles with metadata (featured, tags, dates)
5. **Migrates reforms** — Creates 6 changes, 4 user profiles, and 6 timeline events
6. **Migrates tools** — Creates 8 tools/calculators with descriptions and CTAs
7. **Prints summary** — Shows count of migrated records

## Example Output

```
🚀 Starting content migration...

📚 Migrating FAQ content...
  ✓ Created category "Droits & éligibilité" with 5 items
  ✓ Created category "Montants & calcul" with 4 items
  ✓ Created category "Démarches & formulaires" with 4 items
  ✓ Created category "Réforme 2025" with 3 items
  ✓ Created category "À propos de DocBel" with 2 items
✅ FAQ migration complete

📖 Migrating glossary entries...
  ✓ Created 20 glossary entries
✅ Glossary migration complete

📰 Migrating news items...
  ✓ Created 5 news items
✅ News migration complete

⚡ Migrating reform data...
  ✓ Created 6 reform changes
  ✓ Created 4 reform profiles
  ✓ Created 6 timeline events
✅ Reform migration complete

🛠️  Migrating tools...
  ✓ Created 8 tools
✅ Tools migration complete

═══════════════════════════════════════════════════════════
📊 Migration Summary:
═══════════════════════════════════════════════════════════
  FAQ Categories:        5
  FAQ Items:             18
  Glossary Entries:      20
  News Items:            5
  Reform Changes:        6
  Reform Profiles:       4
  Reform Timeline Items: 6
  Tools:                 8
═══════════════════════════════════════════════════════════
✨ Migration completed successfully!
```

## After Migration

### 1. Verify Data in Admin Panel
- Log in to `/admin` with your admin credentials
- Navigate to each section (FAQ, News, Tools, etc.)
- Verify all content is displayed correctly

### 2. Test Frontend Pages
Frontend pages still fetch from hardcoded data by default. After migration, they need to be updated to fetch from the API:
- `/faq` — Fetch from `/api/faq`
- `/nouvelles` — Fetch from `/api/news`
- `/reforme` — Fetch from `/api/reforms`
- `/outils` — Fetch from `/api/tools`
- `/lexique` — Fetch from `/api/glossary`

### 3. Update Pages (Phase 7)
See **Phase 7: Frontend API Integration** for instructions on updating pages to fetch from the database instead of hardcoded data.

## Rollback / Reset

If you need to rollback the migration:

1. **Delete all records** (in Prisma Studio or DB):
   ```bash
   npx prisma studio
   # Delete records from each table
   ```

2. **Or reset the database**:
   ```bash
   npx prisma migrate reset
   ```

3. **Re-run migration**:
   ```bash
   npm run migrate
   ```

## Multi-Language Support

The migration handles 5 languages:
- **fr** (French)
- **nl** (Dutch)
- **de** (German)
- **en** (English)
- **ar** (Arabic)

Each record has translations for all languages (e.g., `titleFr`, `titleNl`, etc.). The migration copies content across all languages to maintain consistency.

## Migration Script Location

- **Main script**: `scripts/migrate-content.ts`
- **Imports from**:
  - `lib/content.ts` — FAQ, news, reforms, tools
  - `lib/glossary.ts` — Glossary entries
  - `lib/prisma.ts` — Prisma client singleton
  - `lib/i18n.ts` — Language type definitions

## Troubleshooting

### Error: DATABASE_URL not set
- Ensure `.env.local` exists in the project root
- Verify `DATABASE_URL` is set in `.env.local`
- Run the migration with `npm run migrate` to auto-load `.env.local`

### Error: Connection refused
- Check PostgreSQL is running
- Verify connection string in `DATABASE_URL`
- Test with `npx prisma studio`

### Error: Relations not found
- Ensure Prisma migrations have been applied: `npm run prisma:migrate`
- Regenerate Prisma client: `npm run prisma:generate`

### Error: Duplicate key value
- Someone already migrated the data
- Reset the database: `npx prisma migrate reset`
- Re-run migration

## Next Steps

After successful migration, proceed to:
- **Phase 7**: Update frontend pages to fetch from API instead of hardcoded data
- **Phase 8**: Build comprehensive admin forms with RichEditor for creating/editing content
- **Phase 9**: Add advanced features (audit logging, bulk operations, etc.)

## References

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Neon PostgreSQL](https://neon.tech/)
- [DocBel Admin Setup](./ADMIN_SETUP.md)
