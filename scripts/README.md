# Admin Scripts

## Creating Initial Admin User

To create an initial admin user, you need to:

1. Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local` file (get it from Supabase dashboard)
2. Run the script:

```bash
npx tsx scripts/create-admin.ts
```

This will create:
- A Supabase Auth user with email `admin@example.com` and password `admin123`
- A corresponding record in the `admins` table

**Important**: Change the default password immediately after first login!