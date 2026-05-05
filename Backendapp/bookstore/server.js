const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Route Check
app.get('/', (req, res) => {
    res.send('Bookstore API is running');
});

// Books Route
app.use('/api/books', bookRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/bookstoreDB')
    .then(() => console.log('Connected to MongoDB (bookstoreDB)'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Start server on port 6000 (to avoid conflict with 5000 employee app)
const PORT = 6000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});