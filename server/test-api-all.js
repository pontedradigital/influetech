const http = require('http');

function testList() {
    console.log('Testing GET /api/companies...');
    return new Promise((resolve, reject) => {
        http.get('http://localhost:3001/api/companies', (res) => {
            console.log(`GET STATUS: ${res.statusCode}`);
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const companies = JSON.parse(rawData);
                    console.log(`GET RESPONSE: Found ${companies.length} companies`);
                    resolve(companies);
                } catch (e) {
                    console.error('Error parsing GET response:', e);
                    reject(e);
                }
            });
        }).on('error', (e) => {
            console.error(`GET request error: ${e.message}`);
            reject(e);
        });
    });
}

function testUpdate(id) {
    console.log(`Testing PUT /api/companies/${id}...`);
    const data = JSON.stringify({
        name: 'Test Company FINAL',
        contactName: 'Test Contact',
        partnershipStatus: 'Solicitada',
        userId: 'mock-id'
    });

    const options = {
        hostname: 'localhost',
        port: 3001,
        path: `/api/companies/${id}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            console.log(`PUT STATUS: ${res.statusCode}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`PUT BODY: ${chunk}`);
            });
            res.on('end', () => {
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`PUT request error: ${e.message}`);
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

async function run() {
    try {
        const companies = await testList();
        if (companies.length > 0) {
            const testCompany = companies.find(c => c.name.includes('Test Company'));
            if (testCompany) {
                await testUpdate(testCompany.id);
            } else {
                console.log('Test company not found to update');
            }
        }
    } catch (error) {
        console.error('Test failed:', error);
    }
}

run();
