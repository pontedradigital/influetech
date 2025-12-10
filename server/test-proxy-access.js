const http = require('http');

function testProxyList() {
    console.log('Testing GET http://localhost:3000/api/companies (Proxy)...');
    return new Promise((resolve, reject) => {
        http.get('http://localhost:3000/api/companies', (res) => {
            console.log(`PROXY GET STATUS: ${res.statusCode}`);
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    if (res.headers['content-type'] && res.headers['content-type'].includes('application/json')) {
                        const companies = JSON.parse(rawData);
                        console.log(`PROXY GET RESPONSE: Found ${companies.length} companies`);
                        resolve(true);
                    } else {
                        console.log('Response is not JSON. Likely Vite HTML error page or standard index.html fallback.');
                        console.log('First 100 chars:', rawData.substring(0, 100));
                        resolve(false);
                    }
                } catch (e) {
                    console.error('Error parsing PROXY GET response:', e);
                    resolve(false);
                }
            });
        }).on('error', (e) => {
            console.error(`PROXY GET request error: ${e.message}`);
            resolve(false);
        });
    });
}

testProxyList();
