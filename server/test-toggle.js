// using global fetch

const USER_ID = '327aa8c1-7c26-41c2-95d7-b375c25eb896';
const API_URL = 'http://localhost:3001/api/users';

async function test() {
    console.log('--- STARTING TOGGLE TEST ---');

    // 1. Get initial state
    let res = await fetch(`${API_URL}/${USER_ID}`);
    let user = await res.json();
    console.log('1. Initial State:', user.isPublicProfile);

    // 2. Set to FALSE (Hidden)
    console.log('2. Setting to FALSE...');
    res = await fetch(`${API_URL}/${USER_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublicProfile: false })
    });
    let updated = await res.json();
    console.log('   Response from PUT:', updated.isPublicProfile);

    // 3. Verify via GET public list
    res = await fetch(`${API_URL}/public`);
    let publicUsers = await res.json();
    let found = publicUsers.find(u => u.id === USER_ID);
    console.log(`   User found in public list? ${!!found}`);

    // 4. Set back to TRUE (Visible)
    console.log('3. Setting to TRUE...');
    res = await fetch(`${API_URL}/${USER_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublicProfile: true })
    });
    updated = await res.json();
    console.log('   Response from PUT:', updated.isPublicProfile);

    // 5. Verify via GET public list
    res = await fetch(`${API_URL}/public`);
    publicUsers = await res.json();
    found = publicUsers.find(u => u.id === USER_ID);
    console.log(`   User found in public list? ${!!found}`);
}

test();
