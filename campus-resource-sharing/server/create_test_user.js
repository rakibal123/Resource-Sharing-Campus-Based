
const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const email = 'test@campusshare.com';
        const password = 'password123';

        // Delete if exists to ensure clean state
        await User.deleteOne({ email });

        const user = await User.create({
            name: 'Test User',
            email,
            password, // This should be hashed by pre-save hook
            role: 'student'
        });

        console.log(`Created user ${user.email}`);

        // Verify immediately
        const retrievedUser = await User.findOne({ email });
        const isMatch = await retrievedUser.matchPassword(password);
        console.log(`Password match for ${email}: ${isMatch}`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createTestUser();
