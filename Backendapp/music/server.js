const express = require('express');
const mongoose = require('mongoose');
const Song = require('./models/Song');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// a) Create a Database called music
mongoose.connect('mongodb://localhost:27017/music')
    .then(() => console.log('Connected to MongoDB (music database)'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Helper function to render HTML table for browser output (k)
const renderTable = (songs, title, count = null) => {
    let html = `<div style="font-family: Arial, sans-serif; margin: 20px;">`;
    html += `<h2>${title}</h2>`;
    if (count !== null) html += `<h3>Total Count of Documents: ${count}</h3>`;
    
    html += `<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr style="background-color: #f2f2f2;">
            <th>Song Name</th>
            <th>Film Name</th>
            <th>Music Director</th>
            <th>Singer</th>
            <th>Actor</th>
            <th>Actress</th>
            <th>ID (For Update/Delete)</th>
        </tr>`;
    
    songs.forEach(s => {
        html += `<tr>
            <td>${s.Songname || ''}</td>
            <td>${s.Film || ''}</td>
            <td>${s.Music_director || ''}</td>
            <td>${s.singer || ''}</td>
            <td>${s.Actor || '-'}</td>
            <td>${s.Actress || '-'}</td>
            <td style="font-size:12px;">${s._id}</td>
        </tr>`;
    });
    html += `</table><br><a href="/">Back to Home</a></div>`;
    return html;
};

// c) Insert array of 5 song documents
app.get('/seed', async (req, res) => {
    const initialSongs = [
        { Songname: "Tum Hi Ho", Film: "Aashiqui 2", Music_director: "Mithoon", singer: "Arijit Singh" },
        { Songname: "Channa Mereya", Film: "Ae Dil Hai Mushkil", Music_director: "Pritam", singer: "Arijit Singh" },
        { Songname: "Kabira", Film: "Yeh Jawaani Hai Deewani", Music_director: "Pritam", singer: "Tochi Raina" },
        { Songname: "Jai Ho", Film: "Slumdog Millionaire", Music_director: "A.R. Rahman", singer: "Sukhwinder Singh" },
        { Songname: "Raabta", Film: "Agent Vinod", Music_director: "Pritam", singer: "Arijit Singh" }
    ];
    await Song.deleteMany(); // Clear existing docs optional
    await Song.insertMany(initialSongs);
    res.send("<h2 style='font-family: Arial'>5 songs inserted successfully.</h2><a href='/'>View all documents</a>");
});

// d) & k) Display total count and list all documents in browser in tabular format
app.get('/', async (req, res) => {
    const count = await Song.countDocuments();
    const songs = await Song.find();
    const tableHtml = renderTable(songs, "All Songs in Database", count);
    
    // Add helpful links to test other features
    const testingLinks = `
        <div style="font-family: Arial; margin: 20px; padding: 10px; background: #eee;">
            <h3>Testing Endpoints:</h3>
            <ul>
                <li><a href="/seed">Insert initial 5 songs (Step c)</a></li>
                <li><a href="/director/Pritam">List songs by Music Director "Pritam" (Step e)</a></li>
                <li><a href="/director/Pritam/singer/Arijit Singh">List songs by "Pritam" sung by "Arijit Singh" (Step f)</a></li>
                <li><a href="/singer/Arijit Singh/film/Aashiqui 2">List songs sung by "Arijit Singh" from "Aashiqui 2" (Step i)</a></li>
                <li><b>Add Favourite (Step h):</b> <a href="/add?Songname=MyFav&Film=MyFilm&Music_director=MyDirector&singer=MySinger">Add new song</a></li>
            </ul>
            <p><i>To Update (j) or Delete (g), use endpoints like <b>/update/ID?Actor=Salman&Actress=Katrina</b> or <b>/delete/ID</b></i></p>
        </div>
    `;
    res.send(tableHtml + testingLinks);
});

// e) List specified Music Director songs
app.get('/director/:director', async (req, res) => {
    const songs = await Song.find({ Music_director: req.params.director });
    res.send(renderTable(songs, `Songs by Music Director: ${req.params.director}`));
});

// f) List specified Music Director songs sung by specified Singer
app.get('/director/:director/singer/:singer', async (req, res) => {
    const songs = await Song.find({ 
        Music_director: req.params.director, 
        singer: req.params.singer 
    });
    res.send(renderTable(songs, `Songs by ${req.params.director} sung by ${req.params.singer}`));
});

// i) List Songs sung by Specified Singer from specified film
app.get('/singer/:singer/film/:film', async (req, res) => {
    const songs = await Song.find({ 
        singer: req.params.singer, 
        Film: req.params.film 
    });
    res.send(renderTable(songs, `Songs sung by ${req.params.singer} from ${req.params.film}`));
});

// g) Delete the song which you don’t like (Using GET for easy browser testing)
app.get('/delete/:id', async (req, res) => {
    try {
        await Song.findByIdAndDelete(req.params.id);
        res.send("<h2 style='font-family: Arial'>Song Deleted Successfully!</h2><a href='/'>Back to Home</a>");
    } catch(err) {
        res.send("Error deleting song: " + err);
    }
});

// h) Add new song which is your favourite (Using GET query params for easy browser testing)
app.get('/add', async (req, res) => {
    try {
        const { Songname, Film, Music_director, singer } = req.query;
        if(Songname && Film && Music_director && singer) {
            await new Song({ Songname, Film, Music_director, singer }).save();
            res.send("<h2 style='font-family: Arial'>New Favourite Song Added!</h2><a href='/'>Back to Home</a>");
        } else {
            res.send("<h2 style='font-family: Arial'>Missing properties. Use query params: ?Songname=..&Film=..&Music_director=..&singer=..</h2>");
        }
    } catch(err) {
        res.send("Error: " + err);
    }
});

// j) Update the document by adding Actor and Actress name (Using GET query params)
app.get('/update/:id', async (req, res) => {
    try {
        const { Actor, Actress } = req.query;
        if(Actor && Actress) {
            await Song.findByIdAndUpdate(req.params.id, { Actor, Actress });
            res.send("<h2 style='font-family: Arial'>Actor and Actress names added!</h2><a href='/'>Back to Home</a>");
        } else {
            res.send("<h2 style='font-family: Arial'>Missing properties. Use query params: ?Actor=..&Actress=..</h2>");
        }
    } catch(err) {
        res.send("Error: " + err);
    }
});

const PORT = 7000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});