const mongoose = require('mongoose');

// Document has following fields: Songname, Film, Music_director, singer
// j) requires Actor and Actress
const songSchema = new mongoose.Schema({
    Songname: { type: String, required: true },
    Film: { type: String, required: true },
    Music_director: { type: String, required: true },
    singer: { type: String, required: true },
    Actor: { type: String, default: '' },
    Actress: { type: String, default: '' }
}, {
    collection: 'song details' // b) Create a collection called "song details"
});

module.exports = mongoose.model('Song', songSchema);
