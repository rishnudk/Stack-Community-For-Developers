# Implementation Guide - Complete Feature Set

This guide covers all 10 features that have been implemented in your project.

## 📋 Table of Contents

1. [Protected Routes & Session Handling](#1-protected-routes--session-handling)
2. [User Dashboard Page](#2-user-dashboard-page)
3. [Connect tRPC to Authenticated User](#3-connect-trpc-to-authenticated-user)
4. [User Posts CRUD](#4-user-posts-crud)
5. [Frontend Create Post Form](#5-frontend--create-post-form)
6. [List Posts on Dashboard](#6-list-posts-dashboard)
7. [Edit / Delete Post](#7-edit--delete-post)
8. [Global UI Components](#8-global-ui-components)
9. [Toast / Notification System](#9-toast--notification-system)
10. [User Profile Page](#10-user-profile-page)

---

## ✅ Setup Steps

### 1. Run Database Migration

First, you need to create a migration for the new `Post` model:

```bash
cd apps/api
npx prisma migrate dev --name add_post_model
npx prisma generate
```

### 2. Environment Variables

Make sure your `.env` files have:
- `NEXTAUTH_SECRET` - Required for JWT token verification
- `DATABASE_URL` - PostgreSQL connection string
- OAuth credentials (GITHUB_ID, GITHUB_SECRET, etc.)

### 3. Start Services

```bash
# Terminal 1: Start API server
cd apps/api
pnpm dev

# Terminal 2: Start Next.js app
cd apps/web
pnpm dev
```

---

## 1. Protected Routes & Session Handling

### Implementation

✅ **Middleware (`apps/web/middleware.ts`)**
- Uses `next-auth/middleware` with `withAuth`
- Protects `/dashboard` and `/profile` routes
- Redirects unauthenticated users to `/api/auth/signin`

✅ **Session in tRPC Context (`apps/api/src/context.ts`)**
- Extracts JWT token from cookies or Authorization header
- Verifies token using `jose` library with `NEXTAUTH_SECRET`
- Fetches user from database and attaches to context

### How It Works

1. When a user visits `/dashboard`, middleware checks for session
2. If no session → redirect to sign-in page
3. Frontend tRPC requests include cookies automatically
4. Fastify API reads cookies from request headers
5. JWT is verified and user session is attached to tRPC context

---

## 2. User Dashboard Page

### Location
- `apps/web/app/dashboard/page.tsx` (server component)
- `apps/web/app/dashboard/DashboardClient.tsx` (client component)

### Features
- ✅ Displays user info (name, email, image)
- ✅ Shows user ID
- ✅ Logout button using `signOut()` from next-auth
- ✅ Links to profile page
- ✅ Displays post creation form
- ✅ Lists all user posts

### Usage
Navigate to `/dashboard` after signing in.

---

## 3. Connect tRPC to Authenticated User

### Implementation

✅ **Protected Procedure (`apps/api/src/trpc/router.ts`)**
```typescript
const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, session: ctx.session } });
});
```

✅ **getCurrentUser Procedure**
- Returns authenticated user's full profile
- Uses `protectedProcedure` to ensure user is logged in

### How to Use

```typescript
// In client component
const { data: user } = trpc.getCurrentUser.useQuery();
```

---

## 4. User Posts CRUD

### Database Schema

The `Post` model has been added to `apps/api/prisma/schema.prisma`:

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### tRPC Procedures

All post operations are protected (require authentication):

- `createPost` - Create a new post
- `getPosts` - Get all posts by the logged-in user
- `getPost` - Get a single post (only if user owns it)
- `editPost` - Update a post (only if user owns it)
- `deletePost` - Delete a post (only if user owns it)

### Security
All post operations verify that the user owns the post before allowing modifications.

---

## 5. Frontend — Create Post Form

### Location
`apps/web/app/components/CreatePost.tsx`

### Features
- ✅ Simple form with title and content fields
- ✅ Validation (requires both fields)
- ✅ Loading states during submission
- ✅ Toast notifications on success/error
- ✅ Auto-refresh post list after creation

### Usage
```tsx
import { CreatePost } from '@/app/components/CreatePost';

<CreatePost />
```

---

## 6. List Posts (Dashboard)

### Location
`apps/web/app/components/PostList.tsx`

### Features
- ✅ Shows all posts created by logged-in user
- ✅ Ordered by creation date (newest first)
- ✅ Displays post title, content, and timestamps
- ✅ Shows author information
- ✅ Includes edit and delete buttons

### Usage
Already integrated into the dashboard page.

---

## 7. Edit / Delete Post

### Implementation

✅ **Edit Functionality**
- Click "Edit" button on any post
- Inline editing with form fields
- Save/Cancel buttons
- Validation and error handling

✅ **Delete Functionality**
- Click "Delete" button
- Confirmation dialog
- Soft delete (removed from database)
- Auto-refresh list after deletion

### tRPC Mutations
- `editPost` - Updates post title and content
- `deletePost` - Removes post from database

---

## 8. Global UI Components

### Location
`packages/ui/`

### Components Created

1. **Button** (`button.tsx`)
   - Variants: `primary`, `secondary`, `danger`
   - Full TypeScript support
   - Disabled states

2. **Card** (`card.tsx`)
   - Card container
   - CardHeader, CardTitle, CardContent subcomponents

3. **Input** (`input.tsx`)
   - Label support
   - Error messages
   - Full HTML input props

4. **Textarea** (`textarea.tsx`)
   - Label support
   - Error messages
   - Full HTML textarea props

### Usage
```tsx
import { Button } from '@repo/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/card';
```

---

## 9. Toast / Notification System

### Implementation
- ✅ Installed `sonner` library
- ✅ Added `Toaster` component to root layout
- ✅ Integrated in all mutation operations
- ✅ Success and error notifications

### Usage

```typescript
import { toast } from 'sonner';

// Success
toast.success('Operation successful!');

// Error
toast.error('Something went wrong');

// Info
toast.info('Just so you know...');
```

### Configuration
Located in `apps/web/app/layout.tsx`:
```tsx
<Toaster position="top-right" richColors />
```

---

## 10. User Profile Page

### Location
- `apps/web/app/profile/page.tsx` (server component)
- `apps/web/app/profile/ProfileClient.tsx` (client component)

### Features
- ✅ View email (read-only)
- ✅ Update name
- ✅ Update profile image URL
- ✅ Image preview
- ✅ Toast notifications
- ✅ Link back to dashboard

### tRPC Mutation
- `updateProfile` - Updates user name and/or image

### Usage
Navigate to `/profile` after signing in.

---

## 🔧 Configuration Details

### CORS Setup (`apps/api/src/index.ts`)
- Allows credentials (cookies)
- Configured for cookie forwarding from Next.js

### tRPC Client (`apps/web/src/providers/TrpcProvider.tsx`)
- Automatically includes cookies in requests
- Configured to work with Fastify server

### Session Handling
- NextAuth JWT tokens are read from cookies
- Tokens verified using `jose` library
- User data fetched from database for each request

---

## 🚀 Next Steps

1. **Run the migration:**
   ```bash
   cd apps/api
   npx prisma migrate dev --name add_post_model
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Start your servers:**
   - API: `cd apps/api && pnpm dev`
   - Web: `cd apps/web && pnpm dev`

4. **Test the features:**
   - Sign in at `/api/auth/signin`
   - Visit `/dashboard`
   - Create a post
   - Edit/delete posts
   - Update profile at `/profile`

---

## 📝 Notes

- All protected routes automatically redirect to sign-in if not authenticated
- Post operations are scoped to the authenticated user
- Toast notifications provide user feedback for all actions
- UI components are reusable across the application
- TypeScript types are fully configured for all tRPC procedures

---

## 🐛 Troubleshooting

### Session not working?
- Ensure `NEXTAUTH_SECRET` is set in both `.env` files
- Check that cookies are being sent (browser DevTools → Network)

### Posts not showing?
- Run the Prisma migration
- Check database connection
- Verify user is authenticated

### TypeScript errors?
- Run `pnpm install` in root directory
- Regenerate Prisma client: `npx prisma generate`

---

## ✨ All Features Complete!

All 10 features have been successfully implemented. Your application now has:
- ✅ Protected routes with session handling
- ✅ Full user authentication flow
- ✅ Post CRUD operations
- ✅ Beautiful UI components
- ✅ Toast notifications
- ✅ User profile management

Happy coding! 🎉

