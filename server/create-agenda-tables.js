const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('🔧 Criando tabelas da Agenda...');

try {
    // Criar tabela ScheduledPost
    db.exec(`
        CREATE TABLE IF NOT EXISTS ScheduledPost (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            productId TEXT,
            title TEXT NOT NULL,
            caption TEXT,
            platforms TEXT NOT NULL,
            scheduledFor DATETIME NOT NULL,
            status TEXT DEFAULT 'SCHEDULED',
            mediaUrl TEXT,
            mediaType TEXT,
            publishedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES User(id),
            FOREIGN KEY (productId) REFERENCES Product(id)
        );
    `);
    console.log('✅ Tabela ScheduledPost criada');

    // Criar tabela Task
    db.exec(`
        CREATE TABLE IF NOT EXISTS Task (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            priority TEXT DEFAULT 'MEDIUM',
            status TEXT DEFAULT 'TODO',
            dueDate DATETIME,
            completedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES User(id)
        );
    `);
    console.log('✅ Tabela Task criada');

    // Criar tabela Alert
    db.exec(`
        CREATE TABLE IF NOT EXISTS Alert (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            relatedId TEXT,
            isRead INTEGER DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES User(id)
        );
    `);
    console.log('✅ Tabela Alert criada');

    console.log('🎉 Todas as tabelas foram criadas com sucesso!');
} catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    process.exit(1);
}

db.close();
