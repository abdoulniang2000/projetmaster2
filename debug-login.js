// Test script pour vérifier l'API login
const axios = require('axios');

async function testLogin() {
    try {
        console.log('=== Testing Login API ===');

        const response = await axios.post('http://127.0.0.1:8001/api/v1/login', {
            email: 'admin@example.com',
            password: 'password'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('✅ Success!');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));

        if (response.data.access_token) {
            console.log('✅ Token received:', response.data.access_token.substring(0, 20) + '...');
        }

    } catch (error) {
        console.log('❌ Error:');
        console.log('Status:', error.response?.status);
        console.log('Data:', error.response?.data);
        console.log('Message:', error.message);
    }
}

testLogin();
