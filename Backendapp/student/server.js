const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/Student');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGO_URI = 'mongodb+srv://anikett23:anikett23@devconnector.huxxgif.mongodb.net/?retryWrites=true&w=majority&appName=devConnector'; // Database: student
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB Database: student'))
    .catch(err => console.error('Connection error:', err));

// Initial Data
const initialStudents = [
    { Name: 'ABC', Roll_No: 111, WAD_Marks: 25, CC_Marks: 25, DSBDA_Marks: 25, CNS_Marks: 25, AI_marks: 25, Maths_Marks: 45, Science_Marks: 45 },
    { Name: 'DEF', Roll_No: 112, WAD_Marks: 20, CC_Marks: 20, DSBDA_Marks: 15, CNS_Marks: 20, AI_marks: 20, Maths_Marks: 35, Science_Marks: 35 },
    { Name: 'GHI', Roll_No: 113, WAD_Marks: 30, CC_Marks: 30, DSBDA_Marks: 28, CNS_Marks: 30, AI_marks: 30, Maths_Marks: 50, Science_Marks: 50 },
    { Name: 'JKL', Roll_No: 114, WAD_Marks: 15, CC_Marks: 15, DSBDA_Marks: 25, CNS_Marks: 15, AI_marks: 15, Maths_Marks: 30, Science_Marks: 30 }
];

// View helper for simple HTML responses
const wrapToHTML = (title, body) => `
    <html>
    <head>
        <title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 2rem; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <h2>${title}</h2>
        ${body}
        <br/><br/>
        <a href="/">Go Back</a>
    </body>
    </html>
`;

// Index Page with navigational links
app.get('/', (req, res) => {
    res.send(wrapToHTML('Student Marks Management', `
        <ul>
            <li><a href="/init">c) Insert Initial Array of Documents</a></li>
            <li><a href="/all">d) Display total count and list all documents</a></li>
            <li><a href="/dsbda-gt-20">e) List names of students >20 marks in DSBDA</a></li>
            <li><a href="/update/112">f) Update marks of specified student (Roll 112) by 10</a></li>
            <li><a href="/all-gt-25">g) List names of students >25 marks in all subjects</a></li>
            <li><a href="/math-sci-lt-40">h) List names <40 in Maths and Science</a></li>
            <li><a href="/delete/114">i) Remove specified student document (Roll 114)</a></li>
            <li><a href="/table">j) Display Students Data in Tabular format</a></li>
        </ul>
    `));
});

// c) Insert array of documents
app.get('/init', async (req, res) => {
    try {
        await Student.deleteMany({}); // Clear existing for a fresh start
        await Student.insertMany(initialStudents);
        res.send(wrapToHTML('Init DB', '<p>Initial documents inserted successfully into studentmarks collection!</p>'));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// d) Display total count and list all documents
app.get('/all', async (req, res) => {
    try {
        const students = await Student.find();
        const count = await Student.countDocuments();
        let body = `<p><strong>Total Count:</strong> ${count}</p><ul>`;
        students.forEach(s => {
            body += `<li>${s.Name} (Roll: ${s.Roll_No}) - WAD: ${s.WAD_Marks}, DSBDA: ${s.DSBDA_Marks}</li>`;
        });
        body += '</ul>';
        res.send(wrapToHTML('All Documents', body));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// e) List >20 in DSBDA
app.get('/dsbda-gt-20', async (req, res) => {
    try {
        const students = await Student.find({ DSBDA_Marks: { $gt: 20 } }, 'Name DSBDA_Marks');
        let body = `<ul>`;
        students.forEach(s => body += `<li>${s.Name} (DSBDA: ${s.DSBDA_Marks})</li>`);
        body += '</ul>';
        res.send(wrapToHTML('Students >20 in DSBDA', body));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// f) Update the marks of Specified students by 10
app.get('/update/:roll', async (req, res) => {
    try {
        const roll = parseInt(req.params.roll);
        const result = await Student.updateOne(
            { Roll_No: roll },
            { $inc: { WAD_Marks: 10, CC_Marks: 10, DSBDA_Marks: 10, CNS_Marks: 10, AI_marks: 10, Maths_Marks: 10, Science_Marks: 10 } }
        );
        let msg = result.modifiedCount > 0 ? `Marks updated by +10 for Roll Number ${roll}` : 'Student not found';
        res.send(wrapToHTML('Update Marks', `<p>${msg}</p>`));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// g) List >25 in all subjects
app.get('/all-gt-25', async (req, res) => {
    try {
        const students = await Student.find({
            WAD_Marks: { $gt: 25 },
            CC_Marks: { $gt: 25 },
            DSBDA_Marks: { $gt: 25 },
            CNS_Marks: { $gt: 25 },
            AI_marks: { $gt: 25 }
        }, 'Name');
        let body = `<ul>`;
        students.forEach(s => body += `<li>${s.Name}</li>`);
        body += '</ul>';
        res.send(wrapToHTML('Students >25 in ALL subjects', body));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// h) List less than 40 in both Maths and Science
app.get('/math-sci-lt-40', async (req, res) => {
    try {
        const students = await Student.find({
            Maths_Marks: { $lt: 40 },
            Science_Marks: { $lt: 40 }
        }, 'Name Maths_Marks Science_Marks');
        let body = `<ul>`;
        students.forEach(s => body += `<li>${s.Name} (Maths: ${s.Maths_Marks}, Science: ${s.Science_Marks})</li>`);
        body += '</ul>';
        res.send(wrapToHTML('Students <40 in Maths & Science', body));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// i) Remove specified student
app.get('/delete/:roll', async (req, res) => {
    try {
        const roll = parseInt(req.params.roll);
        const result = await Student.deleteOne({ Roll_No: roll });
        let msg = result.deletedCount > 0 ? `Student with Roll Number ${roll} removed.` : 'Student not found';
        res.send(wrapToHTML('Delete Student', `<p>${msg}</p>`));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// j) Display Students data in browser in tabular format
app.get('/table', async (req, res) => {
    try {
        const students = await Student.find();
        let table = `
            <table>
                <tr>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>WAD</th>
                    <th>DSBDA</th>
                    <th>CNS</th>
                    <th>CC</th>
                    <th>AI</th>
                    <th>Maths</th>
                    <th>Science</th>
                </tr>
        `;
        students.forEach(s => {
            table += `
                <tr>
                    <td>${s.Name}</td>
                    <td>${s.Roll_No}</td>
                    <td>${s.WAD_Marks}</td>
                    <td>${s.DSBDA_Marks}</td>
                    <td>${s.CNS_Marks}</td>
                    <td>${s.CC_Marks}</td>
                    <td>${s.AI_marks}</td>
                    <td>${s.Maths_Marks}</td>
                    <td>${s.Science_Marks}</td>
                </tr>
            `;
        });
        table += `</table>`;
        res.send(wrapToHTML('Tabular Format', table));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
