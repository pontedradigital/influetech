// Native fetch in Node 18+


async function checkApi() {
    try {
        const response = await fetch('http://localhost:3000/api/shipments');
        const data = await response.json();
        console.log('API Response Status:', response.status);
        console.log('API Data Count:', Array.isArray(data) ? data.length : 'Not an array');
        console.log('API Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

checkApi();
