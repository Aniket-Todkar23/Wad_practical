const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// 1. Add a new book (POST)
router.post('/', async (req, res) => {
    try {
        const { title, author, price, genre } = req.body;
        const newBook = new Book({ title, author, price, genre });
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Error adding book', error: error.message });
    }
});

// 2. Retrieve a list of all books (GET)
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
});

// 3. Update book details (PUT)
router.put('/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error: error.message });
    }
});

// 4. Delete a book from the collection (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
});

module.exports = router;





































// curl -X POST http://localhost:3000/api/books \
// -H "Content-Type: application/json" \
// -d '{
//   "title": "The Hitchhiker'\''s Guide to the Galaxy",
//   "author": "Douglas Adams",
//   "price": 19.99,
//   "genre": "Science Fiction"
// }'

// curl -X GET http://localhost:3000/api/books

// curl -X PUT http://localhost:3000/api/books/<BOOK_ID> \
// -H "Content-Type: application/json" \
// -d '{
//   "price": 24.99,
//   "genre": "Sci-Fi Comedy"
// }'

// curl -X DELETE http://localhost:3000/api/books/<BOOK_ID>