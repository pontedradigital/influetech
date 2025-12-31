const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('--- DEBUG SALE CREATION ---');

try {
    // 1. Get a product
    const product = db.prepare('SELECT * FROM Product LIMIT 1').get();
    if (!product) {
        console.error('No products found in DB. Cannot test sale creation.');
        process.exit(1);
    }
    console.log('Using Product:', product.name, product.id);

    // 2. Prepare payload data
    const productId = product.id;
    const customerName = 'Heitor Neres Rodrigues';
    const customerCpf = '388.322.378-65';
    const contactChannel = 'WhatsApp';
    const contactValue = '(11) 97038-0804';
    const cep = '03282-001';
    const street = 'Avenida Vila Ema';
    const number = '4191';
    const complement = 'Apto 45';
    const neighborhood = 'Vila Ema';
    const city = 'São Paulo';
    const state = 'SP';
    const salePrice = '399'; // String as from JSON
    const userId = '327aa8c1-7c26-41c2-95d7-b375c25eb896'; // Existing user

    const id = uuidv4();
    const saleDate = new Date().toISOString();

    console.log('Attempting to create sale...');

    // Start transaction
    const insertSale = db.prepare(`
      INSERT INTO Sale (
        id, productId, customerName, customerCpf, contactChannel, contactValue,
        cep, street, number, complement, neighborhood, city, state,
        salePrice, saleDate, status, userId, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, datetime('now'), datetime('now'))
    `);

    insertSale.run(
        id, productId, customerName, customerCpf || null, contactChannel, contactValue,
        cep || null, street || null, number || null, complement || null,
        neighborhood || null, city || null, state || null,
        salePrice, saleDate, userId
    );
    console.log('Sale inserted successfully.');

    // 3. Financial Transaction
    const transactionId = uuidv4();
    const description = `Venda - ${product.name} - ${customerName}`;

    console.log('Attempting to create transaction...');
    db.prepare(`
      INSERT INTO FinancialTransaction (
        id, type, amount, description, date, category, status, userId, createdAt, updatedAt
      ) VALUES (?, 'INCOME', ?, ?, ?, 'Vendas', 'COMPLETED', ?, datetime('now'), datetime('now'))
    `).run(transactionId, salePrice, description, saleDate, userId);
    console.log('Transaction inserted successfully.');

    // 4. Shipment
    const shipmentId = uuidv4();
    const trackingCode = `AG${Date.now().toString().slice(-8)}`;

    console.log('Attempting to create shipment...');
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

    // Calculate recipient address
    const recipientAddress = street && number ? `${street}, ${number}${complement ? ', ' + complement : ''}` : (street || '');

    shipmentStmt.run(
        shipmentId, userId, id,
        // Sender
        null, null, null, null, null, null,
        // Recipient
        customerName,
        recipientAddress,
        city || '',
        state || '',
        cep || '',
        customerCpf || null,
        // Package
        product.weight || 0.5,
        product.height || 10,
        product.width || 10,
        product.length || 10,
        salePrice,
        // Freight
        'A definir', 0, 0,
        // Content
        `${product.brand || ''} ${product.name || 'Produto'}`.trim(),
        1,
        // Metadata
        trackingCode, 'pending', 0, 0
    );
    console.log('Shipment inserted successfully.');

    console.log('SUCCESS! No errors found.');

} catch (error) {
    console.error('ERROR:', error);
    console.error('Stack:', error.stack);
}
