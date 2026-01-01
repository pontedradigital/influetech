
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
    try {
        console.log('🔍 Buscando usuários no banco...');
        const users = await db.user.findMany({ take: 1 });

        if (users.length > 0) {
            console.log('✅ Usuário encontrado:');
            console.log(JSON.stringify(users[0], null, 2));
        } else {
            console.log('❌ Nenhum usuário encontrado na tabela User.');
        }
    } catch (error) {
        console.error('❌ Erro ao buscar usuários:', error);
    } finally {
        await db.$disconnect();
    }
}

main();
