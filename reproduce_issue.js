async function testCreateCompany() {
    try {
        const response = await fetch('http://localhost:3001/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Company ' + Date.now(),
                contactName: 'Test Contact',
                email: 'test@example.com',
                phone: '+5511999999999',
                country: 'Brasil',
                userId: 'mock-id'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Success:', data);
        } else {
            const text = await response.text();
            console.log('Error Status:', response.status);
            console.log('Error Body:', text);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testCreateCompany();
