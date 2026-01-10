-- Create SystemAnnouncement table
CREATE TABLE "SystemAnnouncement" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO', -- INFO, WARNING, URGENGY, UPDATE, NEWS
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdBy" UUID,

    CONSTRAINT "SystemAnnouncement_pkey" PRIMARY KEY ("id")
);

-- Add RLS Policies
ALTER TABLE "SystemAnnouncement" ENABLE ROW LEVEL SECURITY;

-- Everyone can read active announcements
CREATE POLICY "Everyone can read active announcements" ON "SystemAnnouncement"
    FOR SELECT
    USING (active = true);

-- Only Admins can insert/update/delete (You might need to adjust this based on your specific Role implementation)
-- For now, assuming standard authenticated users check content. 
-- In a real scenario you filter by auth.uid() in a User table to check role 'ADMIN'.
-- Example policy (commented out as it depends on exact user role schema mapping):
-- CREATE POLICY "Admins can manage" ON "SystemAnnouncement"
-- USING (exists (select 1 from "User" where id = auth.uid() and role = 'ADMIN'));
