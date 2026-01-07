import fetch from 'node-fetch';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njc4MDk4OTMsInN1YiI6IkU1SFp1ejFiV0ZocjloWkxXcnVZb1hNUElYajIifQ.9nohC921myyqHy39cOXvJiQra0rQogPv4B8Sp4EC5b0';
// Testing Production URL since token might be Prod
const URLS = [
    'https://api.superfrete.com/api/v0/calculator',
    'https://superfrete.com/api/v0/calculator'
];

const payload = {
    "from": { "postal_code": "01153000" },
    "to": { "postal_code": "20020050" },
    "services": "1,2,17",
    "options": {
        "own_hand": false,
        "receipt": false,
        "insurance_value": 0,
        "use_insurance_value": false
    },
    "package": {
        "height": 2,
        "width": 11,
        "length": 16,
        "weight": 0.3
    }
};

async function test() {
    console.log('Testing SuperFrete Production API...');

    for (const url of URLS) {
        console.log(`Testing: ${url}`);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TOKEN}`,
                    'User-Agent': 'Influetech/1.0'
                },
                body: JSON.stringify(payload)
            });

            console.log(`Status: ${response.status}`);
            if (response.ok) {
                const json = await response.json();
                console.log('SUCCESS! Response:', JSON.stringify(json, null, 2));
                return;
            } else {
                const text = await response.text();
                // console.log('Error Body:', text.substring(0, 100));
            }
        } catch (e) {
            console.error(`Failed to connect to ${url}: ${e.message}`);
        }
    }
}

test();
