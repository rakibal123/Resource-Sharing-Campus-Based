const axios = require('axios');

const verifyMyRequests = async () => {
    try {
        // 1. Login to get token (using a known user or registering a temp one)
        // I'll register a temp one to be sure.
        const email = `verify_req_${Date.now()}@example.com`;
        const password = 'password123';

        console.log('1. Registering temp user...');
        const regRes = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Req Verifier',
            email,
            password,
            department: 'CSE'
        });
        const token = regRes.data.token;
        console.log('   Registered and got token.');

        // 2. Fetch My Requests
        console.log('2. Fetching My Requests...');
        const reqRes = await axios.get('http://localhost:5000/api/requests/my-requests', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('   Success! Status:', reqRes.status);
        console.log('   Data:', reqRes.data); // Should be empty array

    } catch (error) {
        console.error('   Failed:', error.response ? error.response.data : error.message);
    }
};

verifyMyRequests();
