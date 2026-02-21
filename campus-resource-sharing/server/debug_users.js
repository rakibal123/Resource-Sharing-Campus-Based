
const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const users = await User.find({});
        console.log('Users found:', users.map(u => ({ email: u.email, password: u.password, role: u.role })));

        // Test password comparison for a known user if any
        if (users.length > 0) {
            const user = users[0];
            const isMatch = await user.matchPassword('password123'); // Assuming a default test password
            console.log(`Password 'password123' match for ${user.email}: ${isMatch}`);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUser();
