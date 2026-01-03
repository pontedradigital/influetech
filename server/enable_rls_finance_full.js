
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function enableRLS(tableName) {
    try {
        console.log(`Enabling RLS for ${tableName}...`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;`);

        // Drop existing policies to avoid conflicts
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can view their own ${tableName}" ON "${tableName}";`);
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can create their own ${tableName}" ON "${tableName}";`);
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can update their own ${tableName}" ON "${tableName}";`);
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can delete their own ${tableName}" ON "${tableName}";`);

        // Create Policies
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can view their own ${tableName}"
            ON "${tableName}"
            FOR SELECT
            USING (auth.uid()::text = "userId");
        `);

        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can create their own ${tableName}"
            ON "${tableName}"
            FOR INSERT
            WITH CHECK (auth.uid()::text = "userId");
        `);

        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can update their own ${tableName}"
            ON "${tableName}"
            FOR UPDATE
            USING (auth.uid()::text = "userId");
        `);

        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can delete their own ${tableName}"
            ON "${tableName}"
            FOR DELETE
            USING (auth.uid()::text = "userId");
        `);
        console.log(`RLS enabled and policies created for ${tableName}`);
    } catch (e) {
        console.error(`Error enabling RLS for ${tableName}:`, e.message);
    }
}

async function main() {
    // FinancialTransaction already done, but no harm ensuring
    const tables = [
        'FinancialGoal',
        'RecurringExpense',
        'AffiliatePlatform',
        'AffiliateEarning'
    ];

    for (const table of tables) {
        await enableRLS(table);
    }

    await prisma.$disconnect();
}

main();
