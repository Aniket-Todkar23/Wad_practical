const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    Name: String,
    Roll_No: Number,
    WAD_Marks: Number,
    CC_Marks: Number,
    DSBDA_Marks: Number,
    CNS_Marks: Number,
    AI_marks: Number,
    Maths_Marks: Number, // Included for query 'h'
    Science_Marks: Number // Included for query 'h'
}, { collection: 'studentmarks' }); // Enforcing collection name 'studentmarks'

module.exports = mongoose.model('Student', studentSchema);
