const express = require('express');

const server = express();

server.get('/hello', (req, res) => {
  res.json({
    date: (new Date()).toISOString(),
    message: 'Hello World!'
  });
});

server.use('*', (req, res) => {
  res.json({ message: 'Not Found' });
});

server.listen(8080, (err) => {
  if (err) throw err;

  console.log('Server started on port 8080');
});
