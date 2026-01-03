
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Applying RLS policies...');

    try {
        await prisma.$executeRawUnsafe(`
        ALTER TABLE "FinancialTransaction" ENABLE ROW LEVEL SECURITY;
    `);
        console.log('RLS Enabled.');
    } catch (e) {
        console.log('RLS enable error (might be already enabled):', e.message);
    }

    try {
        await prisma.$executeRawUnsafe(`
        DROP POLICY IF EXISTS "Users can view their own financial transactions" ON "FinancialTransaction";
        CREATE POLICY "Users can view their own financial transactions"
        ON "FinancialTransaction"
        FOR SELECT
        USING (auth.uid()::text = "userId");

        DROP POLICY IF EXISTS "Users can create their own financial transactions" ON "FinancialTransaction";
        CREATE POLICY "Users can create their own financial transactions"
        ON "FinancialTransaction"
        FOR INSERT
        WITH CHECK (auth.uid()::text = "userId");

        DROP POLICY IF EXISTS "Users can update their own financial transactions" ON "FinancialTransaction";
        CREATE POLICY "Users can update their own financial transactions"
        ON "FinancialTransaction"
        FOR UPDATE
        USING (auth.uid()::text = "userId");

        DROP POLICY IF EXISTS "Users can delete their own financial transactions" ON "FinancialTransaction";
        CREATE POLICY "Users can delete their own financial transactions"
        ON "FinancialTransaction"
        FOR DELETE
        USING (auth.uid()::text = "userId");
    `);
        console.log('Policies applied successfully!');
    } catch (e) {
        console.error('Error applying policies:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
