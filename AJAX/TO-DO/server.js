const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

let tasks = [
    { id: 1, text: 'Learn AJAX', completed: false }
];
let currentId = 2;

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    const task = {
        id: currentId++,
        text: req.body.text,
        completed: false
    };
    tasks.push(task);
    res.json(task);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = req.body.completed;
        if (req.body.text) {
            tasks[taskIndex].text = req.body.text;
        }
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).send('Task not found');
    }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== id);
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
