var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore')
var async = require('async')

var launcher = require('./launcher')
var commander = require('./commander')(launcher)

var app = express()

launcher.reset()

app.use( bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.post('/attack', function(req, res){
  var attackCommands = req.body.commands

  if (attackCommands === undefined)
    return res.sendStatus(422)

  commander.execute(attackCommands, function(err){
    if(err) {
        return res.sendStatus(500)
      }
    res.sendStatus(204)
  })
})

app.post('/reset', function(req, res){
  launcher.reset(function(){
    res.sendStatus(204)
  })
})

var server = app.listen(3000)

