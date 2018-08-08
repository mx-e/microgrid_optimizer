const express        = require('express')
const MongoClient    = require('mongodb').MongoClient
const bodyParser     = require('body-parser')
const app            = express()
const shell          = require('shelljs')

require('./app/routes')(app, {})

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log('We are live on ' + port);
})

app.post('/notes', (req, res) => {
  // You'll create your note here.
  console.log(req.body)
  res.send('Hello')
});