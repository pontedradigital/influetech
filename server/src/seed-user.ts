
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'contato@pontedra.com';
    const password = '123Mudar789';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Checking if user ${email} exists...`);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (!existingUser) {
        console.log('Creating new admin user...');
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Influetech Admin',
                plan: 'PRO',
                active: 1,
            },
        });
        console.log(`User created with ID: ${user.id}`);
    } else {
        console.log('User already exists, updating password...');
        const user = await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                active: 1
            }
        });
        console.log(`User updated with ID: ${user.id}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
