const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000; 
const dataFilePath = path.join(__dirname, 'SteamGames.json');


app.use(express.json());

app.get('/game', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

    const games = JSON.parse(data);
    res.status(200).json(games);
  });
});

app.get('/game/select/:year', (req, res) => {
  const year = parseInt(req.params.year);

  if (isNaN(year)) {
    return res.status(400).json({ error: 'Invalid year' });
  }

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

    const games = JSON.parse(data);
    const filteredGames = games.filter((game) => game.Year > year);

    res.status(200).json(filteredGames);
  });
});

app.get('/game/:name', (req, res) => {
  const gameName = req.params.name;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

    const games = JSON.parse(data);
    const game = games.find((game) => game.Game === gameName);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json({ steamURL: game.GameLink });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
