
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/trending-products',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('BODY:', data.substring(0, 200) + '...');
    });
});

req.on('error', (e) => {
    console.error(`PROBLEM: ${e.message}`);
});

req.end();

const optionsBazar = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/bazares/suggestions',
    method: 'GET',
};

const reqBazar = http.request(optionsBazar, (res) => {
    console.log(`BAZAR STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('BAZAR BODY:', data.substring(0, 200) + '...');
    });
});

reqBazar.on('error', (e) => {
    console.error(`BAZAR PROBLEM: ${e.message}`);
});

reqBazar.end();
