
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkConnection() {
    console.log("🔍 Testing connection to Supabase...");
    try {
        // 1. Check if we can connect
        await prisma.$connect();
        console.log("✅ Network Connection Successful!");

        // 2. Check if we can query (Schema exists)
        const userCount = await prisma.user.count();
        console.log(`✅ Read Permission OK! (Current User Count: ${userCount})`);

        // 3. Check detailed schema by querying a specific table
        const insightsCount = await prisma.insight.count();
        console.log(`✅ Schema Integrity OK! (Insight Table Accessible)`);

        console.log("\n🎉 EVERYTHING IS CONNECTED AND RUNNING CORRECTLY ON SUPABASE!");
    } catch (error) {
        console.error("❌ Connection Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkConnection();
