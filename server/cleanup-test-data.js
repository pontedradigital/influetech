const http = require('http');

async function cleanup() {
    console.log('Cleaning up test companies...');

    // 1. Get List
    const companies = await new Promise((resolve) => {
        http.get('http://localhost:3001/api/companies', (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(JSON.parse(data)));
        });
    });

    // 2. Find Test Companies
    const testCompanies = companies.filter(c => c.name.includes('Test Company'));
    console.log(`Found ${testCompanies.length} test companies to delete.`);

    // 3. Delete them
    for (const company of testCompanies) {
        await new Promise((resolve) => {
            const req = http.request({
                hostname: 'localhost',
                port: 3001,
                path: `/api/companies/${company.id}`,
                method: 'DELETE'
            }, (res) => {
                console.log(`Deleted ${company.name} (ID: ${company.id}): Status ${res.statusCode}`);
                resolve();
            });
            req.end();
        });
    }

    console.log('Cleanup complete.');
}

cleanup();
