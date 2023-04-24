const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 3009;
const path = require("path");
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/api/notes", (req, res) =>
  res.JSON(path.join(__dirname, "/Develop/db/db.json"))
);

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  const newNoteWithId = { ...newNote, id: Math.random() * 10000 };

  // res.json(newNoteWithId);

  var db = JSON.parse(fs.readFile("/Develop/db/db.json"));

  db.push(newNoteWithId);

  fs.writeFile("db.json", JSON.stringify(db), err => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error adding that note");
    }
  });

  res.status(201).json(newNoteWithId);
});

app.listen(process.env.PORT || 5000);
