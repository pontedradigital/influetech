const http = require('http');
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

async function runVerification() {
    console.log('--- Starting Verification ---');

    // 1. Setup: Ensure User 123 has address data
    const userId = '123'; // Assuming this user exists or we update any existing user

    // Find a valid user first to be safe
    const user = db.prepare('SELECT id FROM User LIMIT 1').get();
    if (!user) {
        console.error('No users found in DB. Cannot test.');
        return;
    }
    const TEST_USER_ID = user.id;
    console.log(`Using User ID: ${TEST_USER_ID}`);

    console.log('Updating user profile with address...');
    db.prepare(`
        UPDATE User 
        SET street = 'Rua da Verificação', 
            number = '999', 
            complement = 'Apto 1',
            neighborhood = 'Centro', 
            city = 'Cidade Teste', 
            state = 'TS', 
            cep = '12345-678', 
            cpfCnpj = '11122233344'
        WHERE id = ?
    `).run(TEST_USER_ID);

    // 2. Setup: Ensure a product exists
    let product = db.prepare('SELECT id FROM Product WHERE userId = ? LIMIT 1').get(TEST_USER_ID);
    if (!product) {
        console.log('Creating test product...');
        const productId = 'prod_test_' + Date.now();
        db.prepare(`
            INSERT INTO Product (id, userId, name, price, stock, category, brand)
            VALUES (?, ?, 'Produto Teste', 100, 10, 'Electronics', 'TestBrand')
        `).run(productId, TEST_USER_ID);
        product = { id: productId };
    }
    console.log(`Using Product ID: ${product.id}`);

    // 3. Call API to create sale
    const saleData = {
        productId: product.id,
        customerName: 'Cliente Teste',
        salePrice: 150,
        saleDate: new Date().toISOString(),
        paymentMethod: 'pix',
        contactChannel: 'WhatsApp',
        contactValue: '11999999999',
        // Optional shipment fields
        cep: '99999-999',
        street: 'Rua do Cliente',
        number: '10',
        city: 'Cidade Cliente',
        state: 'CC',
        userId: TEST_USER_ID
    };

    const finalPayload = JSON.stringify(saleData);

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/sales',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(finalPayload),
            'x-user-id': TEST_USER_ID
        }
    };

    console.log('Sending API Request to create sale...');

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('Response:', data);

            if (res.statusCode === 201 || res.statusCode === 200) {
                // 4. Verify DB
                const responseObj = JSON.parse(data);
                const shipmentId = responseObj.shipmentId;
                if (shipmentId) {
                    const shipment = db.prepare('SELECT * FROM Shipment WHERE id = ?').get(shipmentId);
                    console.log('--- Shipment Verification ---');
                    console.log('Sender Name:', shipment.senderName);
                    console.log('Sender Address:', shipment.senderAddress);

                    if (shipment.senderName && shipment.senderAddress !== 'Endereço não cadastrado') {
                        console.log('SUCCESS: Shipment created with valid sender info!');
                    } else {
                        console.log('FAILURE: Shipment created but sender info missing or default.');
                    }
                } else {
                    console.log('FAILURE: No shipmentId in response.');
                }
            } else {
                console.log('FAILURE: API returned error.');
            }
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.write(finalPayload);
    req.end();
}

runVerification();
