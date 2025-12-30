const db = require('better-sqlite3')('prisma/dev.db');

console.log('--- Creating Community Tables ---');

// Community Post
db.exec(`
    CREATE TABLE IF NOT EXISTS CommunityPost (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        content TEXT NOT NULL,
        likesCount INTEGER DEFAULT 0,
        hypesCount INTEGER DEFAULT 0,
        commentsCount INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id)
    )
`);
console.log('✔ CommunityPost table created');

// Post Reaction (Like / Hype)
db.exec(`
    CREATE TABLE IF NOT EXISTS PostReaction (
        id TEXT PRIMARY KEY,
        postId TEXT NOT NULL,
        userId TEXT NOT NULL,
        type TEXT NOT NULL, -- 'LIKE' or 'HYPE'
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (postId) REFERENCES CommunityPost(id),
        FOREIGN KEY (userId) REFERENCES User(id),
        UNIQUE(postId, userId, type)
    )
`);
console.log('✔ PostReaction table created');

// Post Comment
db.exec(`
    CREATE TABLE IF NOT EXISTS PostComment (
        id TEXT PRIMARY KEY,
        postId TEXT NOT NULL,
        userId TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (postId) REFERENCES CommunityPost(id),
        FOREIGN KEY (userId) REFERENCES User(id)
    )
`);
console.log('✔ PostComment table created');

console.log('--- Done ---');
