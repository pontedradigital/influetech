import { generateDailyTrends } from './src/utils/trendGenerator';

console.log('🌱 Seeding trending products...');

generateDailyTrends()
    .then(() => {
        console.log('✅ Seed completed via generator!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    });
