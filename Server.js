// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const fs = require("fs");
const moment = require("moment")

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});


// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.json(db);
});

// Create New note - takes in JSON input
app.post("/api/notes", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var newNote = req.body;
    newNote.id = moment().format();
    console.log(newNote);

    // We then add the json the user sent to the db array
    db.push(newNote);
    // We then display the JSON to the users
    res.json(newNote);
    //writes the new note to the db.json file
    fs.writeFile("db/db.json", JSON.stringify(db, null, 2),function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
});

app.delete("/api/notes/:id", function (req, res) {
    //loop throught the array and if the id matches then remove that object fromt he array
    for (var i =0; i < db.length; i++){
        if (db[i].id.includes(req.params.id)){
        db.splice(i,1);
        break;
        }
    };
    //console.log(req.params.id);
    // We then display the new array to the users
    res.json(db);
    //writes the new array to the db.json file
    fs.writeFile("db/db.json", JSON.stringify(db, null, 2),function (err) {
        if (err) throw err;
        console.log('Deleted!');
    });
});
