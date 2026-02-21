const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, department, role } = req.body;

        // Normalize email
        const normalizedEmail = email ? email.toLowerCase().trim() : '';

        if (!name || !email || !password) {
            res.status(400).json({ message: 'Please add all fields' });
            return;
        }



        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            department,
            role: role || 'student',
        });

        if (user) {
            await AuditLog.create({
                user: user._id,
                action: 'REGISTER',
                details: `User registered with email: ${user.email}`
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                role: user.role,
                status: user.status,
                rating: user.rating,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Normalize email
        const normalizedEmail = email ? email.toLowerCase().trim() : '';

        if (!email || !password) {
            res.status(400).json({ message: 'Please add all fields' });
            return;
        }



        const user = await User.findOne({ email: normalizedEmail });

        if (user && (await user.matchPassword(password))) {
            await AuditLog.create({
                user: user._id,
                action: 'LOGIN',
                details: `User logged in`
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                role: user.role,
                status: user.status,
                rating: user.rating,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = { registerUser, authUser };
