const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('🔧 Criando tabela BazarEvent...');

try {
    db.exec(`
        CREATE TABLE IF NOT EXISTS BazarEvent (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            date DATETIME NOT NULL,
            location TEXT,
            status TEXT DEFAULT 'PLANNED',
            productIds TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES User(id)
        );
    `);
    console.log('✅ Tabela BazarEvent criada com sucesso!');
} catch (error) {
    console.error('❌ Erro ao criar tabela:', error);
    process.exit(1);
}

db.close();
