const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data'); // Ensure 'form-data' package is available or mock it if running in node environment without it?
// Actually axios in node handles FormData from 'form-data' package.
// We need to check if form-data package is installed. If not, we might need to install it or skip this script and rely on manual verification.
// Given previous scripts, axios was installed. Let's try to use a dummy buffer.

const verifyResourceUpload = async () => {
    try {
        // 1. Login
        const email = `verify_res_${Date.now()}@example.com`;
        const password = 'password123';
        console.log('1. Registering temp user for resource upload...');
        const regRes = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Res Uploader',
            email,
            password,
            department: 'CSE'
        });
        const token = regRes.data.token;
        console.log('   Registered.');

        // 2. Create Resource with Image
        console.log('2. Uploading Resource...');
        const form = new FormData();
        form.append('title', 'Test Resource with Image');
        form.append('category', 'Book');
        form.append('description', 'This is a test resource with an image.');

        // Create a dummy file
        const dummyFilePath = './test_image.txt';
        fs.writeFileSync(dummyFilePath, 'This is a test image content');
        form.append('image', fs.createReadStream(dummyFilePath));

        const resRes = await axios.post('http://localhost:5000/api/resources', form, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...form.getHeaders()
            }
        });

        console.log('   Success! Resource ID:', resRes.data._id);
        console.log('   Image URL:', resRes.data.imageUrl);

        // Cleanup
        fs.unlinkSync(dummyFilePath);

    } catch (error) {
        console.error('   Failed:', error.response ? error.response.data : error.message);
    }
};

verifyResourceUpload();
