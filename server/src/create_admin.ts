
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
    try {
        const email = 'contato@pontedra.com';
        const passwordRaw = '1234Mudar';
        const name = 'Admin Pontedra';

        console.log(`🔐 Gerando hash para senha...`);
        const password = await bcrypt.hash(passwordRaw, 10);

        console.log(`👤 Criando ou atualizando usuário ${email}...`);

        const user = await db.user.upsert({
            where: { email },
            update: {
                password, // Atualiza senha se já existir
                active: 1
            },
            create: {
                email,
                password,
                name,
                plan: 'PRO',
                active: 1,
                isPublicProfile: 0
            }
        });

        console.log(`✅ Usuário configurado com sucesso!`);
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);

    } catch (error) {
        console.error('❌ Erro ao criar usuário:', error);
    } finally {
        await db.$disconnect();
    }
}

main();
