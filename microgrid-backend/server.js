const express        = require('express')
const MongoClient    = require('mongodb').MongoClient
const bodyParser     = require('body-parser')
const app            = express()
const shell          = require('shelljs')
var fs               = require("fs");

require('./app/routes')(app, {})

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use( function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  next()
})

app.listen(port, () => {
  console.log('We are live on ' + port);
})

app.post('/modelrequest', (req, res) => {
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