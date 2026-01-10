
import db from './src/db';

async function main() {
    const userId = 'a77773a8-67bb-4037-9ae7-8067186d7e3e';
    console.log(`Checking bazars for user: ${userId}`);

    const bazars = await db.bazarEvent.findMany({
        where: { userId }
    });

    console.log(`Found ${bazars.length} bazars.`);

    for (const bazar of bazars) {
        console.log(`- [${bazar.date.toISOString()}] ${bazar.title} (ID: ${bazar.id})`);

        console.log(`Deleting bazar ${bazar.id}...`);

        // Delete related alerts first (if any manual cleanup needed, though typically unrelated by FK in this schema)
        const deletedAlerts = await db.alert.deleteMany({
            where: { relatedId: bazar.id }
        });
        console.log(`Deleted ${deletedAlerts.count} related alerts.`);

        const deleted = await db.bazarEvent.delete({
            where: { id: bazar.id }
        });
        console.log(`Deleted bazar event.`);
    }
}

main()
    .catch(console.error)
    .finally(() => db.$disconnect());
