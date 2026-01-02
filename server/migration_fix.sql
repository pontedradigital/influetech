-- This script completes the migration, skipping the User table if it already exists

-- First, let's ensure we can work with the existing User table
-- by just adding any missing columns if needed

-- Since many tables were already created, let's just create the missing ones
-- Run this query first to see what's missing:

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Then we can create only the tables that are missing
-- For now, the main tables that might be missing based on your schema:

-- User table modifications (if columns are missing)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'User') THEN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'User' AND column_name = 'isPublicProfile') THEN
      ALTER TABLE "User" ADD COLUMN "isPublicProfile" INTEGER NOT NULL DEFAULT 0;
    END IF;
    -- Add other missing columns as needed
  ELSE
    -- Create User table if it doesn't exist
    CREATE TABLE "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "plan" TEXT NOT NULL DEFAULT 'FREE',
      "active" INTEGER NOT NULL DEFAULT 1,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      "isPublicProfile" INTEGER NOT NULL DEFAULT 0,
      "bio" TEXT,
      "niche" TEXT,
      "location" TEXT,
      "socialInstagram" TEXT,
      "socialLinkedin" TEXT,
      "socialYoutube" TEXT,
      "socialTikTok" TEXT,
      "socialWhatsapp" TEXT,
      "cep" TEXT,
      "street" TEXT,
      "number" TEXT,
      "complement" TEXT,
      "neighborhood" TEXT,
      "city" TEXT,
      "state" TEXT,
      "cpfCnpj" TEXT
    );
  END IF;
END $$;
