const express = require("express");
const path = require("path");
const fs = require("fs");
const { json } = require("express");

const app = express();
const port = process.env.PORT || 8080;

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Static hosting
app.use(express.static("public"));

// Helper Functions
async function readNotes() {
    const notes = await fs.promises.readFile('./db/db.json','utf8');
    // console.log(notes);
    return notes;
}

async function writeNotes(note) {
    const notes = await readNotes();
    const array = JSON.parse(notes);
    array.push(note);
    const pushed = JSON.stringify(array);
    await fs.promises.writeFile('./db/db.json', pushed);
}

//HTML Routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

//API Routes
// Get route to view all notes
app.get("/api/notes", (req, res) => {
//   let notes;
//   fs.readFile("./db/db.json", "utf8", (err, data) => {
//     if (err) {
//       console.error(err);
//     }
//     notes = JSON.parse(data);
//     res.send(notes);
//   });
    readNotes().then(data => res.send(data));

});
// Post route to save and create a new note
app.post("/api/notes", (req, res) => {
  let note = JSON.parse(req.body);
  writeNotes(note);
  res.send(req.body)
});
// Delete route to delete a note
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
});

app.listen(port, () => console.log(`App listening on port ${port}`));
