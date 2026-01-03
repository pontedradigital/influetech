-- Fix privacy issues by restricting access to owner only

-- 1. Reset RLS Policies for Company
ALTER TABLE "Company" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for authenticated" ON "Company";
DROP POLICY IF EXISTS "Users can only see their own companies" ON "Company";

CREATE POLICY "Users can only see their own companies" ON "Company"
    FOR ALL
    TO authenticated
    USING (auth.uid()::text = "userId")
    WITH CHECK (auth.uid()::text = "userId");

-- 2. Reset RLS Policies for MediaKitBrand
ALTER TABLE "MediaKitBrand" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for authenticated" ON "MediaKitBrand";
DROP POLICY IF EXISTS "Users can only see their own brands" ON "MediaKitBrand";

CREATE POLICY "Users can only see their own brands" ON "MediaKitBrand"
    FOR ALL
    TO authenticated
    USING (auth.uid()::text = "userId")
    WITH CHECK (auth.uid()::text = "userId");

-- 3. Reset RLS Policies for Product (Safeguard)
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for authenticated" ON "Product";
DROP POLICY IF EXISTS "Users can only see their own products" ON "Product";

CREATE POLICY "Users can only see their own products" ON "Product"
    FOR ALL
    TO authenticated
    USING (auth.uid()::text = "userId")
    WITH CHECK (auth.uid()::text = "userId");
