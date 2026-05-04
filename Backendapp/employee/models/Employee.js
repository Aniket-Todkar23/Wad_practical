const mongoose = require('mongoose');

const employeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    joiningDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Employee', employeSchema);
