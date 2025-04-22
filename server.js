require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const {protect, authorize} = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/api', authRoutes);
app.use('/api/accounts', protect, accountRoutes);
app.use('/api/transactions', protect, transactionRoutes);
app.use('/api/users', protect, authorize('admin'), userRoutes);

// Connect to MongoDB
const db = require('./config/db');
db.connect();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
