const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        const notes = JSON.parse(data);
        const newNote = {
            id: uuid.v4(),
            title: req.body.title,
            text: req.body.text
        };
        notes.push(newNote);
        fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }
            res.json(newNote);
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);
        fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }
            res.json({ message: 'Note deleted successfully' });
        });
    });
});

const PORT = process.env.PORT || 3001; // Use port 3001 instead of 3000
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
