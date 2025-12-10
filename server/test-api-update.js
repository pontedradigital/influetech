const http = require('http');

const data = JSON.stringify({
    name: 'Test Company EDITED',
    contactName: 'Test Contact',
    partnershipStatus: 'Solicitada',
    // userId is required by schema if creating, let's see for update
    userId: 'mock-id'
});

// We need a valid ID. I'll use the ID from the previous run output if possible, 
// or I can fetch the list first.
// Let's fetch list first.

function getCompanies() {
    http.get('http://localhost:3001/api/companies', (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const companies = JSON.parse(rawData);
                if (companies.length > 0) {
                    const company = companies.find(c => c.name.includes('Test Company'));
                    if (company) {
                        console.log('Found company:', company.id, company.name);
                        updateCompany(company.id);
                    } else {
                        // If test company not found, use first one
                        console.log('Test company not found, using first one');
                        updateCompany(companies[0].id);
                    }
                } else {
                    console.log('No companies found');
                }
            } catch (e) {
                console.error('Error parsing response:', e);
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
}

function updateCompany(id) {
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

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.write(data);
    req.end();
}

getCompanies();
