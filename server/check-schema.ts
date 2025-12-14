import db from './src/db';

try {
    const info = db.prepare("PRAGMA table_info(FinancialTransaction)").all();
    console.log(JSON.stringify(info, null, 2));
} catch (error) {
    console.error(error);
}
