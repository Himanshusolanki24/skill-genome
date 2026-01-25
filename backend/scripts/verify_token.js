const fs = require('fs');
const https = require('https');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '../.env');
let token = null;

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GITHUB_TOKEN=(.+)/);
    if (match && match[1]) {
        token = match[1].trim();
    }
} catch (err) {
    console.error('❌ Could not read .env file:', err.message);
    process.exit(1);
}

if (!token) {
    console.error('❌ No GITHUB_TOKEN found in .env file.');
    process.exit(1);
}

console.log(`Checking token: ${token.substring(0, 4)}...***`);

const options = {
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'SkillGenome-Verifier',
        'Accept': 'application/vnd.github.v3+json'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            const user = JSON.parse(data);
            console.log(`✅ Token is VALID. Authenticated as: ${user.login}`);
        } else {
            console.error(`❌ Token is INVALID. Status: ${res.statusCode} - ${res.statusMessage}`);
            console.error(`Response: ${data}`);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Error connecting to GitHub: ${e.message}`);
});

req.end();
