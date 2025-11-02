# Migration Guide for New Features

## Step 1: Run Database Migration

Before using the new features, you need to migrate your database:

```bash
cd apps/api
npx prisma migrate dev --name add_new_features
npx prisma generate
```

This will:
- Add Comment, PostLike, Tag, PostTag, Notification models
- Add `role` field to User model
- Generate updated Prisma Client types

## Step 2: Update Existing Users

After migration, you may want to set an admin user:

```sql
-- In your database, run:
UPDATE "User" SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

Or via Prisma Studio:
```bash
npx prisma studio
```

## Features Added

### ✅ 11. Post Comments
- Create, read, edit, delete comments
- Comments linked to posts and users
- Auto-notifications when someone comments

### ✅ 12. Post Likes
- Like/unlike posts
- Like counts displayed
- Auto-notifications when someone likes

### ✅ 14. Search/Filter Posts
- Search by title
- Filter by author, tag
- Pagination support (skip/take)

### ✅ 15. Pagination
- Built into getPosts query
- Supports skip/take parameters
- Default: 10 posts per page

### ✅ 16. Notifications
- Store notifications in DB
- Get, mark as read functionality
- Auto-create on comments/likes

### ✅ 19. Post Tags
- Create tags (admin only)
- Add tags to posts
- Filter posts by tags

### ✅ 20. Admin Panel
- Role-based access control
- Admin can delete any post/comment
- Admin can manage users
- Update user roles

### ⏳ 13. Rich Text/Markdown (Next)
- Will add markdown support
- Preview functionality

### ⏳ 17. User Settings (Next)
- Update email
- Change password
- Notification preferences

### ⏳ 18. File Uploads (Next)
- Profile image uploads
- Image storage

## Next Steps

1. Run the migration
2. Generate Prisma client
3. Frontend components will be created next
4. Test all features

