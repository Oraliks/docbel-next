# DocBel Admin Backend Setup

This document describes how to set up and use the DocBel admin panel.

## Prerequisites

- Node.js 18+
- npm
- Neon PostgreSQL account (or local PostgreSQL)
- Environment variables configured in `.env` and `.env.local`

## Database Configuration

### 1. Environment Variables

The `.env` file contains the Prisma database connection:

```bash
# .env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

For **Neon PostgreSQL** (recommended):
```bash
DATABASE_URL="postgresql://neondb_owner:xxx@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

### 2. Verify Database Connection

```bash
npx prisma db push
```

This will:
- Verify the connection to your database
- Apply any pending migrations
- Create tables if they don't exist

### 3. Check Database with Prisma Studio

```bash
npx prisma studio
```

Opens an interactive UI to view and manage database records at `http://localhost:5555`

## Creating the First Admin User

### Option 1: Run Seed Script (Recommended)

```bash
npx ts-node scripts/seed-admin.ts
```

This creates an admin user with:
- Email: `admin@docbel.local` (or from `ADMIN_EMAIL` env var)
- Password: `changeme123` (or from `ADMIN_PASSWORD` env var)

### Option 2: Manual Database Entry

Use Prisma Studio:

1. Open `npx prisma studio`
2. Go to **AdminUser** table
3. Create a new record with:
   - Email: your email
   - passwordHash: Use a hashed password (get from running the seed script once)

## Starting the Admin Panel

### Development Mode

```bash
npm run dev
```

Then visit:
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin (after login)

### Production Build

```bash
npm run build
npm run start
```

## Admin Panel Features

### Dashboard (`/admin`)
- Overview statistics
- Quick action buttons
- Navigation to content sections

### Content Management

| Section | URL | Features |
|---------|-----|----------|
| FAQ | `/admin/faq` | Manage questions, categories, multi-language support |
| News | `/admin/news` | Create/edit news articles, featured articles |
| Reforms | `/admin/reforms` | Manage reform changes, profiles, timeline |
| Tools | `/admin/tools` | Add/edit calculators and tools |
| Glossary | `/admin/glossary` | Manage legal terms definitions |
| UI Strings | `/admin/ui-strings` | Edit translation keys |

### Multi-Language Support

All content sections support editing in **5 languages**:
- 🇫🇷 French (Français)
- 🇳🇱 Dutch (Nederlands)
- 🇩🇪 German (Deutsch)
- 🇬🇧 English
- 🇸🇦 Arabic (العربية)

Content can be edited in each language with language tabs in the form.

## API Endpoints

### Authentication

```
POST /api/auth/login
- Body: { email, password }
- Response: { success, redirectUrl }

POST /api/auth/logout
- Response: { success }

GET /api/admin/check-auth
- Response: { authenticated, userId, email }
```

### Content Management (Coming in next phases)

```
GET    /api/faq               - List all FAQ items
POST   /api/faq               - Create new FAQ
GET    /api/faq/[id]          - Get specific FAQ
PUT    /api/faq/[id]          - Update FAQ
DELETE /api/faq/[id]          - Delete FAQ

(Similar endpoints for: /news, /reforms, /tools, /glossary, /ui-strings)
```

## Security Notes

### Session Management
- Sessions use **JWT tokens** signed with HS256
- Stored in **HTTP-only secure cookies**
- Default duration: **24 hours**
- Session secret: Set `SESSION_SECRET` in `.env.local` (minimum 32 characters)

### Password Hashing
- Uses **SHA-256** for hashing
- Consider upgrading to bcryptjs for production:
  ```bash
  npm install bcryptjs
  npm install -D @types/bcryptjs
  ```

### Production Checklist
- [ ] Set `SESSION_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS in production
- [ ] Use a strong admin password
- [ ] Configure CORS if frontend is on different domain
- [ ] Set up database backups
- [ ] Monitor failed login attempts

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma db push

# View error details
DATABASE_URL="..." npx prisma migrate resolve --applied
```

### Type Errors

```bash
# Regenerate Prisma client
npx prisma generate

# Type check
npx tsc --noEmit
```

### Build Failures

```bash
# Clean build
rm -rf .next
npm run build
```

## Next Phases

- **Phase 4**: CRUD API routes for all content types
- **Phase 5**: WYSIWYG editor integration (TipTap)
- **Phase 6**: Content migration from hardcoded to database
- **Phase 7**: Frontend API integration
- **Phase 8**: Admin dashboard features (stats, bulk operations)
- **Phase 9**: Audit logging, role-based access (future)

## Support

For issues or questions:
1. Check database with `npx prisma studio`
2. Check API responses in browser DevTools
3. Review server logs in development mode
4. Check TypeScript errors: `npx tsc --noEmit`
