const express = require("express");
// const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.static("public"));
// const dbPath = path.join(__dirname, "Develop/db/db.json");

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/api/notes", (req, res) => {
  const db = JSON.parse(fs.readFileSync("./db/db.json"));
  res.json(db);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  const db = JSON.parse(fs.readFileSync("./db/db.json"));
  const newNoteWithId = { ...newNote, id: uuidv4() };

  db.push(newNoteWithId);

  fs.writeFile("./db/db.json", JSON.stringify(db), err => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error adding that note");
    }

    res.status(201).json(newNoteWithId);
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  const db = JSON.parse(fs.readFileSync("./db/db.json"));

  const noteIndex = db.findIndex(note => note.id === noteId);

  if (noteIndex !== -1) {
    db.splice(noteIndex, 1);
    fs.writeFile("./db/db.json", JSON.stringify(db), err => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error deleting that note");
      }
      res.status(200).send("Note deleted successfully");
    });
  } else {
    res.status(404).send("Note not found");
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});
