import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

// List all sales
export const listSales = (req: Request, res: Response) => {
    try {
        const { search } = req.query;

        let query = `
      SELECT 
        s.*,
        p.name as productName,
        p.category as productCategory,
        p.brand as productBrand
      FROM Sale s
      LEFT JOIN Product p ON s.productId = p.id
      ORDER BY s.createdAt DESC
    `;

        let sales = db.prepare(query).all();

        // Apply search filter if provided
        if (search && typeof search === 'string') {
            const searchLower = search.toLowerCase();
            sales = sales.filter((sale: any) =>
                sale.customerName.toLowerCase().includes(searchLower) ||
                sale.productName?.toLowerCase().includes(searchLower) ||
                sale.status.toLowerCase().includes(searchLower) ||
                sale.contactChannel.toLowerCase().includes(searchLower)
            );
        }

        res.json(sales);
    } catch (error) {
        console.error('Error listing sales:', error);
        res.status(500).json({ error: 'Erro ao listar vendas' });
    }
};

// Get sale by ID
export const getSale = (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const sale = db.prepare(`
      SELECT 
        s.*,
        p.name as productName,
        p.category as productCategory,
        p.brand as productBrand,
        p.marketValue as productPrice
      FROM Sale s
      LEFT JOIN Product p ON s.productId = p.id
      WHERE s.id = ?
    `).get(id);

        if (!sale) {
            return res.status(404).json({ error: 'Venda não encontrada' });
        }

        res.json(sale);
    } catch (error) {
        console.error('Error getting sale:', error);
        res.status(500).json({ error: 'Erro ao buscar venda' });
    }
};

// Create sale
export const createSale = (req: Request, res: Response) => {
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
        const id = uuidv4();
        const saleDate = new Date().toISOString();
        const finalUserId = userId === 'mock-id' ? '327aa8c1-7c26-41c2-95d7-b375c25eb896' : (userId || '327aa8c1-7c26-41c2-95d7-b375c25eb896');

        // Insert sale with CPF
        const stmt = db.prepare(`
      INSERT INTO Sale (
        id, productId, customerName, customerCpf, contactChannel, contactValue,
        cep, street, number, complement, neighborhood, city, state,
        salePrice, saleDate, status, userId, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, datetime('now'), datetime('now'))
    `);

        stmt.run(
            id, productId, customerName, customerCpf || null, contactChannel, contactValue,
            cep || null, street || null, number || null, complement || null,
            neighborhood || null, city || null, state || null,
            salePrice, saleDate, finalUserId
        );

        // Get product info for financial transaction and shipment
        const product = db.prepare('SELECT name, category, brand FROM Product WHERE id = ?').get(productId) as any;

        // Create financial transaction (income)
        const transactionId = uuidv4();
        const description = `Venda - ${product?.name || 'Produto'} - ${customerName}`;

        db.prepare(`
      INSERT INTO FinancialTransaction (
        id, type, amount, description, date, category, status, userId, createdAt, updatedAt
      ) VALUES (?, 'INCOME', ?, ?, ?, 'Vendas', 'COMPLETED', ?, datetime('now'), datetime('now'))
    `).run(transactionId, salePrice, description, saleDate, finalUserId);

        // Update product status to SOLD
        db.prepare('UPDATE Product SET status = ? WHERE id = ?').run('SOLD', productId);

        // Get user profile for sender information (usando dados mock por enquanto)
        // TODO: Buscar dados reais do perfil do usuário
        const senderName = 'InflueTech'; // Placeholder
        const senderCep = '01310-100'; // Placeholder
        const senderAddress = 'Av. Paulista, 1000'; // Placeholder
        const senderCity = 'São Paulo'; // Placeholder
        const senderState = 'SP'; // Placeholder

        // Create shipment automatically
        const shipmentId = uuidv4();
        const shipmentStmt = db.prepare(`
      INSERT INTO Shipment (
        id, userId, saleId,
        senderName, senderAddress, senderCity, senderState, senderCep, senderCpfCnpj,
        recipientName, recipientAddress, recipientCity, recipientState, recipientCep, recipientCpfCnpj,
        weight, height, width, length, declaredValue,
        carrier, price, deliveryTime,
        contentDescription, contentQuantity,
        trackingCode, status, labelGenerated, declarationGenerated,
        createdAt, updatedAt
      ) VALUES (
        ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?,
        datetime('now'), datetime('now')
      )
    `);

        // Gerar código de rastreamento temporário
        const trackingCode = `AG${Date.now().toString().slice(-8)}`;

        shipmentStmt.run(
            shipmentId, finalUserId, id,
            // Sender
            senderName, senderAddress, senderCity, senderState, senderCep, null,
            // Recipient
            customerName,
            street && number ? `${street}, ${number}${complement ? ', ' + complement : ''}` : (street || ''),
            city || '',
            state || '',
            cep || '',
            customerCpf || null,
            // Package
            0.5, 10, 10, 10, salePrice,
            // Freight
            'A definir', 0, 0,
            // Content
            `${product?.brand || ''} ${product?.name || 'Produto'}`.trim(),
            1,
            // Metadata
            trackingCode, 'pending', 0, 0
        );

        res.status(201).json({
            id,
            productId,
            customerName,
            salePrice,
            status: 'PENDING',
            shipmentId,
            message: 'Venda criada, envio gerado automaticamente, registrado no financeiro e status do produto atualizado para Vendido'
        });
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ error: 'Erro ao criar venda' });
    }
};

// Update sale status
export const updateSale = (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const stmt = db.prepare(`
      UPDATE Sale 
      SET status = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);

        const result = stmt.run(status, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Venda não encontrada' });
        }

        res.json({ message: 'Status da venda atualizado' });
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(500).json({ error: 'Erro ao atualizar venda' });
    }
};

// Delete sale (with cascade delete for related records)
export const deleteSale = (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // 1. Verificar se a venda existe e obter informações
        const sale = db.prepare('SELECT * FROM Sale WHERE id = ?').get(id) as any;

        if (!sale) {
            return res.status(404).json({ error: 'Venda não encontrada' });
        }

        // 2. Excluir transações financeiras relacionadas à venda
        // Identificamos pela descrição que contém o nome do cliente e categoria "Vendas"
        const deleteTransactions = db.prepare(`
            DELETE FROM FinancialTransaction 
            WHERE description LIKE ? 
            AND type = 'INCOME' 
            AND category = 'Vendas'
            AND userId = ?
        `);

        const transactionPattern = `%${sale.customerName}%`;
        const transactionsResult = deleteTransactions.run(transactionPattern, sale.userId);

        // 3. Excluir envios relacionados à venda (vinculados por saleId)
        const deleteShipments = db.prepare('DELETE FROM Shipment WHERE saleId = ?');
        const shipmentsResult = deleteShipments.run(id);

        // 4. Excluir a venda
        const deleteSaleStmt = db.prepare('DELETE FROM Sale WHERE id = ?');
        const saleResult = deleteSaleStmt.run(id);

        console.log(`Venda ${id} excluída com sucesso:`, {
            venda: saleResult.changes,
            envios: shipmentsResult.changes,
            transacoes: transactionsResult.changes
        });

        res.json({
            message: 'Venda e registros relacionados excluídos com sucesso',
            excluidos: {
                venda: saleResult.changes,
                envios: shipmentsResult.changes,
                transacoes: transactionsResult.changes
            }
        });
    } catch (error) {
        console.error('Erro ao excluir venda:', error);
        res.status(500).json({ error: 'Erro ao excluir venda' });
    }
};
