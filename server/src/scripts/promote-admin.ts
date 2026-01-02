import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const promoteUser = async () => {
    const email = process.argv[2] || 'influetechapp@gmail.com';

    console.log(`🔍 Buscando usuário: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.error('❌ Usuário não encontrado no banco de dados.');
        console.log('💡 Dica: Faça login/cadastro com esse e-mail na plataforma primeiro para criar o registro.');
        process.exit(1);
    }

    await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
    });

    console.log(`✅ SUCESSO! O usuário ${email} agora é um ADMIN.`);
};

promoteUser()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
