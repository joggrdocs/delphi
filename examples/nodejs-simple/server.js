const path = require('path');
const fs = require('fs');
const express = require('express');

const server = express();

server.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'index.html'), (err, file) => {
    if (err) return res.send(`Fatal Error: ${err.message}`);

    res.send(file.toString());
  });
});

server.get('/hello', (req, res) => {
  res.json({
    message: process.env.MESSAGE || 'Hello World!'
  });
});

server.listen(3000, (err) => {
  if (err) throw err;

  console.log('Server started on port 3000');
});
