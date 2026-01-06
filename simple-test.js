// Test simple de l'API
const http = require('http');

const data = JSON.stringify({
    email: 'admin@example.com',
    password: 'password'
});

const options = {
    hostname: '127.0.0.1',
    port: 8001,
    path: '/api/v1/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Testing API login...');

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('BODY:', body);
        try {
            const json = JSON.parse(body);
            console.log('PARSED JSON:', JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('NOT JSON:', body);
        }
    });
});

req.on('error', (e) => {
    console.error(`PROBLEM: ${e.message}`);
});

req.write(data);
req.end();
