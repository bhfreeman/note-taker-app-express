const express = require("express");
const { v4: uuidv4 } = require('uuid');
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
    const newId = uuidv4();
    note.id = newId;
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
    let note = req.body;   
  writeNotes(note);
  res.send(req.body)
});
// Delete route to delete a note
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  readNotes().then((data) => {
      const array = JSON.parse(data);
      const deleteIndex = array.findIndex(obj => obj["id"] === id);
    //   console.log(array);
      array.splice(deleteIndex,1);
    //   console.log(deleteIndex);
    //   console.log(array)
      fs.writeFile('./db/db.json', JSON.stringify(array), (err) => err ? console.error(err): console.log("file written"));
  }).then(res.redirect("back"))
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

app.listen(port, () => console.log(`App listening on port ${port}`));
