
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Verificando Vínculos UIDD (Últimas 5 Vendas) ---');

    const sales = await prisma.sale.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            financialTransactions: true,
            shipments: true
        }
    });

    if (sales.length === 0) {
        console.log('Nenhuma venda encontrada.');
        return;
    }

    sales.forEach(sale => {
        console.log(`\nVENDA: ${sale.id} (Criada em: ${sale.createdAt.toISOString()})`);
        console.log(`- Cliente: ${sale.customerName}`);

        // Verificando Transacoes
        if (sale.financialTransactions && sale.financialTransactions.length > 0) {
            sale.financialTransactions.forEach(tx => {
                console.log(`  > Transação Financeira: ${tx.id} | SaleID no registro: ${tx.saleId} | Status: ${tx.status}`);
            });
        } else {
            console.log('  > [ALERTA] Nenhuma Transação Financeira vinculada a esta venda (via relation).');
            // Tentar buscar 'solta' para ver se existe mas nao vinculou
            // Note: This is hard to do without context, but let's assume relation handles it.
        }

        // Verificando Envios
        if (sale.shipments && sale.shipments.length > 0) {
            sale.shipments.forEach(s => {
                console.log(`  > Envio: ${s.id} | SaleID no registro: ${s.saleId} | Tracking: ${s.trackingCode}`);
            });
        } else {
            console.log('  > [INFO] Nenhum Envio vinculado.');
        }
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
