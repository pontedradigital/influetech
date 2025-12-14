import { PrismaClient } from '@prisma/client'
try {
    const prisma = new PrismaClient()
    console.log('Prisma initialized')
} catch (e) {
    console.error(e)
}
