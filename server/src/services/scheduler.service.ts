import cron from 'node-cron';
import { generateDailyTrends } from '../utils/trendGenerator';

export class SchedulerService {
    static init() {
        // Schedule task to run every day at midnight (00:00)
        cron.schedule('0 0 * * *', async () => {
            console.log('🔄 Running daily product trend update...');
            try {
                await generateDailyTrends();
                console.log('✅ Daily trends updated successfully.');
            } catch (error) {
                console.error('❌ Error updating daily trends:', error);
            }
        });

        console.log('⏰ Scheduler Service initialized (Daily updates at 00:00)');
    }
}
