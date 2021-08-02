const express = require('express');

const server = express();

server.get('/hello', (req, res) => {
  res.json({message: 'Hello World!'});
});

server.listen(8080, (err) => {
  if (err) throw err;

  console.log('Server started on port 8080');
});
