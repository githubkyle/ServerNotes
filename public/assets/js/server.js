const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 3009;
const { v4: uuidv4 } = require("uuid");
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/notes.html"))
);
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "/index.html")));

app.get("/api/notes", (req, res) => res.JSON(path.join(__dirname, "/db.json")));

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  const newNoteWithId = { ...newNote, id: uuidv4() };

  res.json(newNoteWithId);

  const db = JSON.parse(data);

  db.notes.push(newNoteWithId);

  fs.writeFile("db.json", JSON.stringify(db), err => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error adding that note");
    }
  });

  res.status(201).json(newNoteWithId);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
