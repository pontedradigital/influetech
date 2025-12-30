// using global fetch
// Test script for Community Feed API

const API_URL = 'http://localhost:3001/api/community';
const USER_ID = '327aa8c1-7c26-41c2-95d7-b375c25eb896';

async function testCommunityAPI() {
    console.log('--- TESTING COMMUNITY FEED API ---');

    // 1. Test POST /posts (Create Post)
    console.log('\n1. Creating a new post...');
    try {
        const res = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: USER_ID,
                content: 'Test post from script ' + new Date().toISOString()
            })
        });

        if (res.ok) {
            const data = await res.json();
            console.log('✅ Post created successfully!', data);
        } else {
            console.error('❌ Failed to create post. Status:', res.status, res.statusText);
            const text = await res.text();
            console.error('Response:', text);
        }
    } catch (error) {
        console.error('❌ Network error creating post:', error.message);
    }

    // 2. Test GET /posts (Read Feed)
    console.log('\n2. Fetching feed...');
    try {
        const res = await fetch(`${API_URL}/posts?userId=${USER_ID}`);
        if (res.ok) {
            const data = await res.json();
            console.log(`✅ Feed fetched successfully! Found ${data.length} posts.`);
            if (data.length > 0) {
                console.log('Latest post:', data[0]);
            }
        } else {
            console.error('❌ Failed to fetch feed. Status:', res.status);
        }
    } catch (error) {
        console.error('❌ Network error fetching feed:', error.message);
    }
}

testCommunityAPI();
