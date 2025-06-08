require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the admin directory
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// MongoDB connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/theother-me', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to MongoDB');
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/theother-me');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if we can't connect to the database
});

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Schemas
const waitlistSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email address'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Waitlist = mongoose.model('Waitlist', waitlistSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Middleware for admin authentication
const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({ _id: decoded.adminId });

        if (!admin) {
            throw new Error();
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate as admin' });
    }
};

// Routes
app.post('/api/waitlist', async (req, res) => {
    try {
        console.log('Received waitlist submission:', req.body);
        const { email } = req.body;
        
        if (!email) {
            console.log('No email provided');
            return res.status(400).json({ error: 'Email is required' });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            console.log('Invalid email format:', email);
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Check if email already exists
        const existingEmail = await Waitlist.findOne({ email });
        if (existingEmail) {
            console.log('Email already exists:', email);
            return res.status(200).json({ message: 'You are already on the waitlist!' });
        }

        // Create new waitlist entry
        const waitlistEntry = new Waitlist({ email });
        await waitlistEntry.save();
        console.log('Successfully saved email to waitlist:', email);

        // Send confirmation email
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Welcome to TheOther.me Waitlist!',
                html: `
                    <h1>Welcome to TheOther.me!</h1>
                    <p>Thank you for joining our waitlist. We'll keep you updated on our progress and let you know when we launch.</p>
                    <p>Best regards,<br>TheOther.me Team</p>
                `
            });
            console.log('Confirmation email sent to:', email);
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            // Don't fail the request if email fails
        }

        // Send notification to admin
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL,
                subject: 'New Waitlist Signup',
                html: `
                    <h1>New Waitlist Signup</h1>
                    <p>Email: ${email}</p>
                    <p>Time: ${new Date().toLocaleString()}</p>
                `
            });
            console.log('Admin notification sent');
        } catch (emailError) {
            console.error('Error sending admin notification:', emailError);
            // Don't fail the request if email fails
        }

        res.status(201).json({ message: 'Successfully joined the waitlist!' });
    } catch (error) {
        console.error('Error adding to waitlist:', error);
        res.status(500).json({ error: 'Failed to join waitlist: ' + error.message });
    }
});

// Admin routes
app.post('/api/admin/register', async (req, res) => {
    try {
        console.log('Received admin registration request:', req.body);
        const { username, password } = req.body;
        
        if (!username || !password) {
            console.log('Missing username or password');
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            console.log('Username already taken:', username);
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        // Create admin
        const admin = new Admin({
            username,
            password: hashedPassword
        });
        await admin.save();
        console.log('Admin account created successfully:', username);

        res.status(201).json({ message: 'Admin account created successfully' });
    } catch (error) {
        console.error('Error creating admin account:', error);
        res.status(500).json({ error: 'Failed to create admin account: ' + error.message });
    }
});

app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find admin
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Protected routes
app.get('/api/waitlist', authenticateAdmin, async (req, res) => {
    try {
        const entries = await Waitlist.find().sort({ createdAt: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch waitlist' });
    }
});

app.get('/api/waitlist/export', authenticateAdmin, async (req, res) => {
    try {
        const entries = await Waitlist.find().sort({ createdAt: -1 });
        
        // Convert to CSV
        const csv = [
            ['Email', 'Date Joined'],
            ...entries.map(entry => [
                entry.email,
                entry.createdAt.toISOString()
            ])
        ].map(row => row.join(',')).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=waitlist.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: 'Failed to export waitlist' });
    }
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 