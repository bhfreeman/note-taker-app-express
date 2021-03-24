const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;



//Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//Static hosting
app.use(express.static('public'));

//HTML Routes
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname,'public','notes.html'));
});

//API Routes
// Get route to view all notes
app.get('/api/notes', (req,res) => {

});
// Post route to save and create a new note
app.post('/api/notes', (req,res) => {
    let note =req.body;
})
// Delete route to delete a note
app.delete('/api/notes/:id', (req,res) => {
    const { id } = req.params;
})

app.listen(PORT, () => console.log('App listening on port ${PORT}'));