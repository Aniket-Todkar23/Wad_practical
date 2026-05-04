const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// In-memory array acting as our database
let users = [];

// Handle Registration Data (AJAX POST)
app.post('/api/register', (req, res) => {
    const newUser = req.body;
    
    // Check if email already exists
    if (users.find(u => u.email === newUser.email)) {
        return res.status(400).json({ success: false, message: 'Email already exists!' });
    }

    users.push(newUser);
    res.json({ success: true, message: 'Registration successful!' });
});

// Handle Login (AJAX POST)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.email === username && u.password === password);
    if (user) {
        res.json({ success: true, message: 'Login successful!' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
});

// Get all users for the data list
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
