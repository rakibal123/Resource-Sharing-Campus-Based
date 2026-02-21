const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const users = await User.find().sort({ createdAt: -1 }).limit(5);
        console.log('--- Recent Users ---');
        users.forEach(u => {
            console.log(`- ${u.name} (${u.email}) [${u.role}] Created: ${u.createdAt}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
};

listUsers();
