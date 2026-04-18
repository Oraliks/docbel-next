# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DocBel** is a Belgian unemployment benefits information platform in Next.js 14. Provides clear, accessible explanations of unemployment regulations ("chômage") with comprehensive support for 5 core languages (French, Dutch, German, English, Arabic) plus 55+ fallback languages.

**Current status**: Static content with hardcoded data in TypeScript files.  
**Planned**: Full admin backend with PostgreSQL, CRUD operations, authentication, WYSIWYG editor (see `.claude/plans/radiant-hatching-popcorn.md` for 9-phase roadmap).

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint via next lint
npx tsc --noEmit # Type-check without emitting
```

**No automated tests exist.** TypeScript type-checking is the main correctness gate. Build will fail if type errors exist.

## Architecture & Tech Stack

**Framework:** Next.js 14.2.5 App Router with TypeScript 5.4 (strict mode)  
**UI:** React 18.3 — all pages use `'use client'` (no Server Components)  
**Theming:** `next-themes` for dark/light mode (attribute-based, no OS sync)  
**Styling:** Vanilla CSS with CSS custom properties; no frameworks (no Tailwind)  
**Path alias:** `@/*` maps to project root (configured in `tsconfig.json`)

**Provider tree** (defined in `app/layout.tsx`):
```
<html lang="fr" suppressHydrationWarning>
  <body>
    <ThemeProvider> (next-themes, attribute="data-theme", defaultTheme="light")
      <LanguageProvider> (custom React context)
        <NotifBar />
        <Navbar /> (with theme toggle, language selector)
        <main>{children}</main>
        <Footer />
      </LanguageProvider>
    </ThemeProvider>
  </body>
</html>
```

### i18n system

All translation logic lives in two files:

**`lib/i18n.ts`** — Short UI strings (flat key dict):
- `LANGUAGES` — 65 languages with `{code, name, nativeName, flag, rtl?}`
- `FULL_TRANSLATIONS = ['fr','nl','de','en','ar']` — languages with complete translations
- `translations: Record<FullLang, Dict>` — ~200 flat keys per language (e.g. `'sim.q1.o1'`, `'ref.tag.modified'`)
- `translate(code, key, vars?)` — resolves lang, interpolates `{varName}` placeholders
- `resolveLang(code)` — falls back to `'fr'` for non-core languages
- `LEGAL_TERMS` — list of Belgian legal terms (ONEM, C4, VDAB, etc.) that must never be translated

**`lib/content.ts`** — Long-form structured content (FAQ answers with HTML, reform data, news, tools):
- `FAQ_CONTENT`, `REFORM_CHANGES`, `REFORM_PROFILES`, `REFORM_TIMELINE`, `REFORM_FAQ_ITEMS`, `NEWS_ITEMS`, `TOOLS_ITEMS` — all typed as `Record<FullLang, T[]>`
- Getters: `getFaqContent(code)`, `getReformChanges(code)`, etc. — call `resolveLang()` internally, so passing any language code is safe
- FAQ answers use `{ type: 'p'|'info', html: string }` blocks rendered via `dangerouslySetInnerHTML`

**`components/LanguageProvider.tsx`** — wraps `translate()` in a `useLang()` hook:
- Exposes `{ lang, setLang, t(key, vars?), isRTL, isFull }`
- Persists selection to `localStorage` key `docbel.lang`
- Sets `document.documentElement.dir` to `rtl` for Arabic/Hebrew/Persian/Urdu
- `isFull` — true only for the 5 core languages; used to show `🤖 {t('lang.ai.notice')}` banners on content pages

### Styling

All styles are in `app/globals.css` — no CSS modules or Tailwind. Theming uses CSS custom properties (`--primary`, `--text`, `--surface`, etc.) scoped to `[data-theme="light"]` and `[data-theme="dark"]`. The Belgian gradient logo uses `linear-gradient(95deg, #000 0%, #FFD800 50%, #E41E20 100%)` with `-webkit-background-clip: text`. Mobile breakpoint is `900px`.

### Adding a new translation key

1. Add the key to all 5 langs in `translations` in `lib/i18n.ts`
2. Use `t('your.key')` in any component that calls `useLang()`

### Adding long-form content for a new language

Add the language code to `FULL_TRANSLATIONS` in `lib/i18n.ts`, populate all 5 data structures in `lib/content.ts`, and add a full `translations` entry.

### Key constraints

- `LEGAL_TERMS` (ONEM, C4, C131A, VDAB, FOREM, Actiris, etc.) must remain untranslated in all languages — they are proper Belgian administrative terms
- Non-core languages (60+) silently fall back to French content; pages show the AI-notice banner when `!isFull`
- `next-themes` uses `attribute="data-theme"` and `enableSystem={false}` (no OS theme sync)
- Notification bar dismissal persists to `localStorage` key `docbel-notif-dismissed`

### File Organization

```
docbel-next/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (imports globals.css FIRST)
│   ├── error.tsx                # Error boundary for runtime errors
│   ├── not-found.tsx            # 404 page (Belgian theme + animations)
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles + @keyframes + CSS variables
│   ├── faq/                      # FAQ section
│   ├── nouvelles/                # News section
│   ├── reforme/                  # 2025 reform details
│   ├── outils/                   # Tools & calculators
│   ├── lexique/                  # Glossary
│   ├── simulation/               # Benefits simulator
│   └── contact/                  # Contact form
│
├── components/
│   ├── LanguageProvider.tsx     # i18n context + useLang() hook
│   ├── LanguageSelector.tsx     # Language switcher dropdown
│   ├── ThemeProvider.tsx        # next-themes wrapper
│   ├── Navbar.tsx               # Navigation with dropdowns
│   ├── Footer.tsx               # Footer
│   └── NotifBar.tsx             # Notification banner
│
├── lib/
│   ├── i18n.ts                  # Translation system (996 lines, 5 languages)
│   ├── content.ts               # Hardcoded content (FAQ, news, reforms, tools)
│   └── glossary.ts              # Legal terms glossary
│
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
└── CLAUDE.md                     # This file
```

### Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Home: hero, services, benefits explainer |
| `/faq` | `app/faq/page.tsx` | FAQ with categories |
| `/nouvelles` | `app/nouvelles/page.tsx` | News/updates |
| `/reforme` | `app/reforme/page.tsx` | 2025 reform details |
| `/outils` | `app/outils/page.tsx` | Tools & calculators directory |
| `/lexique` | `app/lexique/page.tsx` | Glossary of terms |
| `/simulation` | `app/simulation/page.tsx` | Benefits calculator |
| `/contact` | `app/contact/page.tsx` | Contact form |
| `*` | `app/not-found.tsx` | 404 catch-all |

### Error Pages (Recently Implemented)

**`app/not-found.tsx`** — 404 page
- Client component with animated Belgian theme (🍟 frites falling, 🍺 beer clinking)
- Full i18n support (all 5 languages)
- CSS animations defined in `globals.css` (@keyframes fritesFall, beerClink)
- Smooth transitions with `prefers-reduced-motion` accessibility support
- Navigation buttons: home, FAQ links

**`app/error.tsx`** — Error boundary for runtime errors (500, etc.)
- Catches errors during client-side rendering
- Displays error code (500), title, detail message
- Retry button to reset component state
- Navigation links for recovery
- Logs error to console in development
- Full multilingual support

**CSS Animations** in `app/globals.css`:
- `@keyframes fritesFall` — vertical drop with rotation + opacity fade (4s duration)
- `@keyframes beerClink` — horizontal scale + translate (3s infinite)
- `@keyframes errorShake` — subtle X-axis shake for error emphasis
- All animations respect `prefers-reduced-motion` media query for accessibility

**Translation Keys Added** (in `lib/i18n.ts` for all 5 languages):
- `error.404.title`, `error.404.sub`, `error.404.detail`
- `error.500.title`, `error.500.sub`, `error.500.detail`
- `error.belgian` (humorous Belgian reference)

**Critical CSS Import Fix:**
- `globals.css` MUST be imported first in `app/layout.tsx`
- Incorrect import order causes CSS to disappear on page refresh
- Current order: `./globals.css` → types → fonts → components → providers

## Planned: Admin Backend with PostgreSQL

**Status:** Comprehensive 9-phase plan created (not yet implemented)  
**Plan location:** `.claude/plans/radiant-hatching-popcorn.md`

### Overview

Transform DocBel from static content (hardcoded in `lib/content.ts`, `lib/i18n.ts`, `lib/glossary.ts`) to dynamic CMS with:
- **PostgreSQL + Prisma ORM** — database for all content
- **Single admin account** — no user registration (login + password via bcryptjs)
- **CRUD API routes** — create/read/update/delete for all content types
- **WYSIWYG editor** — TipTap for rich text content editing
- **Admin dashboard** — `/admin` routes with protected layout
- **Content migration** — move 857 FAQ items + all hardcoded content to database

### Planned Phases

1. **Database Setup** — Prisma schema with 10 models (AdminUser, FaqCategory, FaqItem, NewsItem, ReformChange, ReformProfile, ReformTimeline, ToolItem, GlossaryEntry, UiString)
2. **i18n Admin Keys** — Add admin.* translation keys for all 5 languages
3. **Authentication** — Login/logout API routes, session management, protected middleware
4. **Admin Dashboard UI** — Layout, homepage, list/form pages for each content type
5. **API CRUD Routes** — Full REST endpoints for all content types
6. **WYSIWYG Editor** — TipTap integration for rich text fields
7. **Content Migration** — Script to migrate hardcoded data to database
8. **Frontend API Integration** — Update pages to fetch from API instead of hardcoded data
9. **Admin Features** — Stats dashboard, recent edits, bulk operations

### Key Implementation Details

**Database Schema** (simplified):
- `AdminUser` — email, hashedPassword, updatedAt
- `FaqCategory` — name translations (5 langs)
- `FaqItem` — categoryId, question, answer (rich HTML), translations
- `NewsItem` — title, body, tags, date, translations
- `ReformChange` — before/after, translations
- And more for profiles, timelines, tools, glossary, UI strings

**Authentication**:
- HTTP-only cookies for session management
- bcryptjs for password hashing
- Middleware to protect `/admin` and `/api` routes
- Login page at `/admin/login`

**Admin Panel**:
- Protected layout at `/app/admin`
- List views for each content type (FAQ, news, reforms, tools, glossary, UI strings)
- Create/edit forms with TipTap WYSIWYG for rich text
- Language tabs for editing content in all 5 languages
- Delete confirmations, success/error toasts

**Dependencies to Install**:
```bash
npm install @prisma/client
npm install -D prisma
npm install bcryptjs
npm install -D @types/bcryptjs
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image
```

### When to Start Backend Work

The plan is complete and ready for implementation. Next step would be:
1. Confirm PostgreSQL database availability (local or remote)
2. Run Phase 1: Database Setup
3. Run migrations
4. Proceed with authentication (Phase 3)
5. Build admin UI (Phase 4)

## Common Patterns & Important Details

### Using useLang() Hook

All components that need translations should use the `useLang()` hook:
```typescript
'use client'
import { useLang } from '@/components/LanguageProvider'

export default function MyComponent() {
  const { t, lang, setLang, isRTL, isFull } = useLang()
  return <h1>{t('my.translation.key')}</h1>
}
```

Returns object with:
- `lang` — current language code (e.g., 'fr', 'en', 'ar')
- `setLang(code)` — change language (persists to localStorage)
- `t(key, vars?)` — translate key; interpolates variables like `{varName}`
- `isRTL` — true for Arabic, Persian, etc.
- `isFull` — true only for 5 core languages; false for fallback languages

### Handling Hydration Mismatches

Components accessing browser APIs should use this pattern:
```typescript
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null  // Avoid hydration mismatch

return <div>{/* content that depends on window/localStorage */}</div>
```

Example: `components/Navbar.tsx` uses this pattern for theme toggle.

### Adding New Translation Keys

1. Open `lib/i18n.ts`
2. Locate the `translations` object; find the French dictionary
3. Add key: `'my.namespace.key': 'Texte français'`
4. Translate to Dutch, German, English, Arabic in their respective dicts
5. Use in any client component:
   ```typescript
   const { t } = useLang()
   <h1>{t('my.namespace.key')}</h1>
   ```

If translation is missing for a language, falls back to French.

### Creating New Pages

1. Create folder in `app/` (e.g., `app/my-page/`)
2. Add `page.tsx` with `'use client'` at top
3. Import and use `useLang()` for i18n
4. Optional: add `layout.tsx` for page-specific layout
5. Add navigation link in `components/Navbar.tsx` if user-facing

### CSS Variables & Theming

CSS custom properties defined in `app/globals.css`:
```css
html[data-theme="light"] {
  --bg: #ffffff;
  --text: #000000;
  --primary: #0066cc;
  /* ... */
}
html[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #ffffff;
  --primary: #4da6ff;
  /* ... */
}
```

Usage in components: `color: var(--text);` etc.

Switching theme:
```typescript
const { theme, setTheme } = useTheme()
setTheme('dark')  // or 'light'
```

## Common Gotchas

| Problem | Cause | Fix |
|---------|-------|-----|
| CSS disappears on F5 refresh | `globals.css` not imported first in `layout.tsx` | Move `import './globals.css'` to line 1 of `app/layout.tsx` |
| `useLang()` throws error | Used outside LanguageProvider | Ensure component is within provider tree (check `layout.tsx`) |
| Theme toggle doesn't work | Missing `mounted` state check | Use `useEffect` pattern before rendering theme-dependent UI |
| Translation key shows `[key.not.found]` | Key missing in `lib/i18n.ts` | Add key to all 5 language dicts in `translations` object |
| 404 page doesn't load | Missing `app/not-found.tsx` | Ensure file exists and is a client component with `'use client'` |
| Error page doesn't catch errors | Component not wrapped in `<html>`  | Error boundaries need root-level structure |
| Language persists incorrectly | localStorage errors silently caught | Check browser console; verify localStorage not disabled |

## Before Submitting a Build

1. **Type check:** `npx tsc --noEmit` — must pass
2. **Linting:** `npm run lint` — check for warnings
3. **Build test:** `npm run build` — must complete successfully
4. **CSS verification:**
   - Navigate to any page
   - Press F5 (refresh) — CSS should remain
   - Toggle theme — should apply immediately
   - Toggle language — should apply immediately
5. **Error pages:**
   - Visit `/nonexistent` → 404 page loads with animations
   - Check animations are smooth and Belgian-themed
6. **Type safety:** No type errors in build output

## Getting Help

**Type errors:**
```bash
npx tsc --noEmit
```
Shows detailed TypeScript errors with line numbers.

**CSS issues:**
- Check import order in `app/layout.tsx` (globals.css must be first)
- Open DevTools → Styles tab → verify CSS loaded
- Check `data-theme` attribute on `<html>` element
- Verify no CSS is overriding your styles

**i18n issues:**
- Search `lib/i18n.ts` for translation key
- Verify key exists in all 5 language dicts (fr, nl, de, en, ar)
- Check spelling/case sensitivity
- If missing, translation falls back to French

**Theme issues:**
- Verify `<html>` has `data-theme` attribute
- Check CSS variables are defined for current theme in `globals.css`
- Use browser DevTools to inspect computed styles

**Build failures:**
- Always run `npx tsc --noEmit` first to catch type errors
- Type errors must be fixed before build succeeds
- Check console output for specific error messages

## Useful References

- **Next.js 14 Docs:** https://nextjs.org/docs
- **React 18 Hooks:** https://react.dev/reference/react/hooks
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **next-themes:** https://github.com/pacocoursey/next-themes
- **CSS Custom Properties:** https://developer.mozilla.org/en-US/docs/Web/CSS/--*

## Project Metadata

- **Version:** 0.1.0
- **Node requirement:** ^16.0.0 (check package.json)
- **Build target:** ES2020+
- **Strict TypeScript mode:** ✅ Enabled
- **Type checking required for build:** ✅ Yes
- **Total translation keys:** ~200 per language (5 languages = 1000 keys)
- **Hardcoded content:** ~1900 lines across 3 files (will migrate to DB)
- **Last updated:** 2026-04-18
