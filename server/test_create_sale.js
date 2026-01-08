
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Testando Criação de Nova Venda com Vínculo ---');

    // 1. Mock Data
    const userId = (await prisma.user.findFirst()).id; // Get first user
    if (!userId) {
        console.log('Nenhum usuário encontrado para teste.');
        return;
    }

    const product = await prisma.product.findFirst({ where: { status: 'PUBLISHED' } });
    if (!product) {
        console.log('Nenhum produto PUBLICADO encontrado. Criando um dummy...');
        // Create dummy product if needed, but lets assume user has one or skip
    }
    const productId = product ? product.id : (await prisma.product.create({
        data: {
            name: 'Produto Teste Cascade',
            category: 'Teste',
            userId,
            status: 'PUBLISHED'
        }
    })).id;

    console.log(`Usando User: ${userId}`);
    console.log(`Usando Produto: ${productId}`);

    const saleDate = new Date();
    const salePrice = 150.00;

    // 2. Transaction Logic (Replicating sale.controller.ts)
    const result = await prisma.$transaction(async (tx) => {
        // A. Create Sale
        const newSale = await tx.sale.create({
            data: {
                productId,
                customerName: 'Cliente Teste Cascade',
                contactChannel: 'WhatsApp',
                contactValue: '11999999999',
                salePrice,
                saleDate,
                status: 'PENDING',
                userId
            }
        });

        console.log(`Venda Criada: ${newSale.id}`);

        // B. Create Financial Transaction
        const ft = await tx.financialTransaction.create({
            data: {
                type: 'INCOME',
                amount: salePrice,
                description: 'Venda Teste Cascade',
                date: saleDate,
                category: 'Vendas',
                status: 'COMPLETED',
                userId,
                saleId: newSale.id // <--- CRITICAL LINK
            }
        });
        console.log(`Transação Financeira Criada: ${ft.id} | SaleID: ${ft.saleId}`);

        // C. Create Shipment
        const sh = await tx.shipment.create({
            data: {
                userId,
                saleId: newSale.id, // <--- CRITICAL LINK
                recipientName: 'Cliente Teste',
                recipientAddress: 'Rua Teste',
                recipientCity: 'Cidade',
                recipientState: 'SP',
                recipientCep: '00000000',
                weight: 1, height: 10, width: 10, length: 10, price: 0, deliveryTime: 0,
                carrier: 'Teste',
                contentDescription: 'Produto Teste',
            }
        });
        console.log(`Envio Criado: ${sh.id} | SaleID: ${sh.saleId}`);

        return { newSale, ft, sh };
    });

    console.log('\n--- Verificação Final ---');
    if (result.ft.saleId === result.newSale.id && result.sh.saleId === result.newSale.id) {
        console.log('SUCESSO: Vínculos criados corretamente!');
    } else {
        console.error('FALHA: Vínculos não correspondem!');
    }

    // Cleanup (Comment out if you want to keep data to test delete in UI)
    // await prisma.sale.delete({ where: { id: result.newSale.id } }); // This should cascade delete everything!
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
