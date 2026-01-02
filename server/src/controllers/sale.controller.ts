import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

// List all sales
export const listSales = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        const userId = (req as any).user.id;

        const where: any = { userId };

        if (search && typeof search === 'string') {
            where.OR = [
                { customerName: { contains: search, mode: 'insensitive' } },
                { contactChannel: { contains: search, mode: 'insensitive' } },
                { status: { contains: search, mode: 'insensitive' } },
                { product: { name: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const sales = await db.sale.findMany({
            where,
            include: {
                product: {
                    select: {
                        name: true,
                        category: true,
                        brand: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Flatten result to match original response format (some frontend components typically expect flat structure or we adjust frontend.
        // The original SQL returned:
        // s.*, p.name as productName, ...
        // We should map it to maintain compatibility.

        const mappedSales = sales.map(s => ({
            ...s,
            productName: s.product?.name,
            productCategory: s.product?.category,
            productBrand: s.product?.brand
        }));

        res.json(mappedSales);
    } catch (error) {
        console.error('Error listing sales:', error);
        res.status(500).json({ error: 'Erro ao listar vendas' });
    }
};

// Get sale by ID
export const getSale = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    try {
        const sale = await db.sale.findUnique({
            where: { id },
            include: {
                product: {
                    select: {
                        name: true,
                        category: true,
                        brand: true,
                        marketValue: true
                    }
                }
            }
        });

        if (!sale) {
            return res.status(404).json({ error: 'Venda não encontrada' });
        }

        const result = {
            ...sale,
            productName: sale.product?.name,
            productCategory: sale.product?.category,
            productBrand: sale.product?.brand,
            productPrice: sale.product?.marketValue
        };

        res.json(result);
    } catch (error) {
        console.error('Error getting sale:', error);
        res.status(500).json({ error: 'Erro ao buscar venda' });
    }
};

// Create sale
export const createSale = async (req: Request, res: Response) => {
    const {
        productId,
        customerName,
        customerCpf,
        contactChannel,
        contactValue,
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        salePrice,
        userId
    } = req.body;

    try {
        const finalUserId = (req as any).user.id; // Auth handled
        const saleDate = new Date();

        // 1. Get Product info
        // 2. Get User info (for sender details)
        // 3. Create Sale, Transaction, Shipment in transaction

        const product = await db.product.findUnique({ where: { id: productId } });
        const user = await db.user.findUnique({ where: { id: finalUserId } });

        // Prepare data for transaction
        const trackingCode = `AG${Date.now().toString().slice(-8)}`;

        const senderName = user?.name || 'Vendedor Influetech';
        const senderAddress = user?.street ? `${user.street}, ${user.number}${user.complement ? ' ' + user.complement : ''}` : 'Endereço não cadastrado';

        // Execute transaction
        const result = await db.$transaction(async (tx: any) => {
            // A. Create Sale
            const newSale = await tx.sale.create({
                data: {
                    productId,
                    customerName,
                    customerCpf: customerCpf || null,
                    contactChannel,
                    contactValue,
                    cep: cep || null,
                    street: street || null,
                    number: number || null,
                    complement: complement || null,
                    neighborhood: neighborhood || null,
                    city: city || null,
                    state: state || null,
                    salePrice,
                    saleDate,
                    status: 'PENDING',
                    userId: finalUserId
                }
            });

            // B. Create Financial Transaction
            const description = `Venda - ${product?.name || 'Produto'} - ${customerName}`;
            await tx.financialTransaction.create({
                data: {
                    type: 'INCOME',
                    amount: salePrice,
                    description,
                    date: saleDate,
                    category: 'Vendas',
                    status: 'COMPLETED',
                    userId: finalUserId
                }
            });

            // C. Update Product Status
            await tx.product.update({
                where: { id: productId },
                data: { status: 'SOLD' }
            });

            // D. Create Shipment
            const newShipment = await tx.shipment.create({
                data: {
                    userId: finalUserId,
                    saleId: newSale.id,
                    // Sender
                    senderName,
                    senderAddress,
                    senderCity: user?.city || 'Não informado',
                    senderState: user?.state || 'UF',
                    senderCep: user?.cep || '00000-000',
                    senderCpfCnpj: user?.cpfCnpj || null,
                    // Recipient
                    recipientName: customerName,
                    recipientAddress: street && number ? `${street}, ${number}${complement ? ', ' + complement : ''}` : (street || ''),
                    recipientCity: city || '',
                    recipientState: state || '',
                    recipientCep: cep || '',
                    recipientCpfCnpj: customerCpf || null,
                    // Package
                    weight: product?.weight || 0.5,
                    height: product?.height || 10,
                    width: product?.width || 10,
                    length: product?.length || 10,
                    declaredValue: Number(salePrice),
                    // Freight
                    carrier: 'A definir',
                    price: 0,
                    deliveryTime: 0,
                    // Content
                    contentDescription: `${product?.brand || ''} ${product?.name || 'Produto'}`.trim(),
                    contentQuantity: 1,
                    // Metadata
                    trackingCode,
                    status: 'pending',
                    labelGenerated: 0,
                    declarationGenerated: 0
                }
            });

            return { sale: newSale, shipment: newShipment };
        });

        res.status(201).json({
            id: result.sale.id,
            productId,
            customerName,
            salePrice,
            status: 'PENDING',
            shipmentId: result.shipment.id,
            message: 'Venda criada, envio gerado automaticamente, registrado no financeiro e status do produto atualizado para Vendido'
        });

    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ error: 'Erro ao criar venda' });
    }
};

// Update sale status
export const updateSale = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user.id;

    try {
        // Verify ownership
        const existing = await db.sale.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Venda não encontrada' });
        if (existing.userId !== userId) return res.status(403).json({ error: 'Acesso negado' });
        await db.sale.update({
            where: { id },
            data: { status }
        });
        res.json({ message: 'Status da venda atualizado' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Venda não encontrada' });
        }
        console.error('Error updating sale:', error);
        res.status(500).json({ error: 'Erro ao atualizar venda' });
    }
};

// Delete sale (with cascade delete for related records)
export const deleteSale = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    try {
        // 1. Get sale info
        const sale = await db.sale.findUnique({ where: { id } });

        if (!sale) {
            return res.status(404).json({ error: 'Venda não encontrada' });
        }

        if (sale.userId !== userId) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // 2. Delete related Financial Transactions (Manual)
        // Pattern: Contains customer name and Category 'Vendas'
        // This is a bit risky if customer has same name, but was standard logic.
        const transactionPattern = sale.customerName; // contains logic in prisma

        const deletedTransactions = await db.financialTransaction.deleteMany({
            where: {
                description: { contains: transactionPattern },
                type: 'INCOME',
                category: 'Vendas',
                userId: sale.userId
            }
        });

        // 3. Delete Sale (Cascade deletes Shipment automatically)
        // Schema: Shipment sale Sale? @relation(fields: [saleId], references: [id], onDelete: Cascade)

        await db.sale.delete({
            where: { id }
        });

        console.log(`Venda ${id} excluída com sucesso`);

        res.json({
            message: 'Venda e registros relacionados excluídos com sucesso',
            excluidos: {
                transacoes: deletedTransactions.count
            }
        });
    } catch (error) {
        console.error('Erro ao excluir venda:', error);
        res.status(500).json({ error: 'Erro ao excluir venda' });
    }
};
