const http = require('http');

async function run() {
    const payload = {
        name: "Test Company EDITED BY SCRIPT",
        contactName: "Test Contact",
        email: "",
        phone: "",
        country: "",
        website: "",
        contactMethod: "",
        contactValue: "",
        partnershipStatus: "Solicitada",
        userId: "mock-id"
        // status and rating are missing, effectively undefined
    };

    console.log('Testing PUT with exact frontend payload:', JSON.stringify(payload, null, 2));

    // Get ID first
    const companies = await new Promise((resolve) => {
        http.get('http://localhost:3001/api/companies', (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(JSON.parse(data)));
        });
    });

    const testCompany = companies.find(c => c.name.includes('Test Company'));
    if (!testCompany) {
        console.error('Test company not found');
        return;
    }

    const options = {
        hostname: 'localhost',
        port: 3001,
        path: `/api/companies/${testCompany.id}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(payload).length
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
    });

    req.write(JSON.stringify(payload));
    req.end();
}

run();
