
-- Runs a manual sync between Supabase Auth and public.User table.
-- FIXES ERROR: 23502 null value in column "password"

INSERT INTO public."User" (
    id, 
    email, 
    name, 
    role, 
    active, 
    "updatedAt", 
    "createdAt", 
    plan, 
    "planCycle", 
    "paymentStatus", 
    password -- Added specific column
)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) as name,
    'USER' as role,
    1 as active,
    now() as "updatedAt",
    created_at as "createdAt",
    'START' as plan,
    'MONTHLY' as "planCycle",
    'ACTIVE' as "paymentStatus",
    'MANAGED_BY_SUPABASE_AUTH' as password -- Dummy password to satisfy NOT NULL constraint
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    "updatedAt" = now();

SELECT count(*) as total_users FROM public."User";
