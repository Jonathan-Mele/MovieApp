const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use('/', express.static(path.join(__dirname)));


app.use('/static/css', express.static(path.join(__dirname, 'static/css')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});


app.get('/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, 'templates', `${page}`));
});

app.listen(PORT, () => {
  console.log(`Frontend server is running at http://localhost:${PORT}`);
});
