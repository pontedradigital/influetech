// Native fetch used 
// Node 18+ has built-in fetch. The user has Node 24.

async function triggerError() {
    try {
        const response = await fetch('http://localhost:3001/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Company',
                contactName: 'Test Contact',
                email: 'test@company.com',
                phone: '123456789',
                userId: 'mock-id'
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', data);
    } catch (err) {
        console.error('Request failed:', err);
    }
}

triggerError();
