const express        = require('express')
const MongoClient    = require('mongodb').MongoClient
const bodyParser     = require('body-parser')
const app            = express()
const shell          = require('shelljs')
var fs               = require("fs");

require('./app/routes')(app, {})

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log('We are live on ' + port);
})

app.post('/notes', (req, res) => {
  // You'll create your note here.
  console.log(req.body)

  const dir = __dirname

  console.log('Starting Shell Script...')
  shell.exec('./get_output.sh ' + dir + '/../model/' )

  const contents = fs.readFileSync("output.json")
  const data = JSON.parse(contents)
  console.log('Sent Model Results!')
  res.send(data)
});