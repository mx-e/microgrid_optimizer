const express        = require('express')
const bodyParser     = require('body-parser')
const app            = express()
const shell          = require('shelljs')
var fs               = require("fs");

require('./app/routes')(app, {})

const port = 8000;

app.use(bodyParser.json({ extended: true }));

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
  
  const inputData = JSON.stringify({
    T: req.body.T,
    N: req.body.N, 
    demand: generateDemandData(req.body),
    fit: generateFitData(req.body),
    gec: generateGecData(req.body),
    pv_cap_fr: generateCapFrData(req.body),
    ncc: generateNccData(req.body),
    scc: generateSccData(req.body)
  })

  fs.writeFileSync('input.json', inputData);
  console.log('Input Data Written!')
  const dir = __dirname

  console.log('Starting Shell Script...')
  shell.exec('./get_output.sh ' + dir + '/../model/' )

  const contents = fs.readFileSync('output.json')
  const data = JSON.parse(contents)
  console.log('Sent Model Results!')
  res.send(data)
})

const generateDemandData = (request) => {
  if(request.T === 24){
    return request.households.map(household => {
      const averageDemand = []
      household.demandWinter.forEach( (d,i) => {
        const avg = (d + household.demandSummer[i] + household.demandSpringFall[i]) / 3
        averageDemand.push(avg)
      })
      return averageDemand
    })
  }else if(request.T === (24*30)){

  }else{

  }
}

const generateFitData = (request) => {
  return Array.apply(null, Array(request.T)).map(Number.prototype.valueOf,0.05)
}

const generateGecData = (request) => {
  return Array.apply(null, Array(request.T)).map(Number.prototype.valueOf,0.30);
}

const generateCapFrData = (request) => {
  if(request.T === 24){
    return [0,0,0,0,0,0,0.05,0.07,0.13,0.24,0.45,0.67,0.88,0.78,0.71,0.55,0.43,0.25,0.13,0.08,0,0,0,0]
  }
}

const generateNccData = (request) => {
  return Array.apply(null, Array(request.N)).map(Number.prototype.valueOf,1);
}

const generateSccData = (request) => {
  return Array.apply(null, Array(request.N)).map(Number.prototype.valueOf,0.6);
}