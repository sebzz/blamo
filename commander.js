
var _ = require('underscore')
var async = require('async')

var MOVE_TIME = 1000

var commander = function(launcher){
  
  function execute(attackCommands, callback){
    var launcherCommands = _.chain(attackCommands)
                            .map(convertToCommand)
                            .value()
    
    return async.waterfall(launcherCommands, function(err, result){
      if(err){
        return callback(err)
      }
      launcher.reset(callback)
    })
  }

  function convertToCommand(char){
    switch (char){
      case 'U':
        return _.partial(launcher.up, MOVE_TIME)
      case 'D': 
        return _.partial(launcher.down, MOVE_TIME)
      case 'L':
        return _.partial(launcher.left, MOVE_TIME)
      case 'R':
        return _.partial(launcher.right, MOVE_TIME)
      case 'F':
        return launcher.fire
      default:
        return _.identity
    }
  }

  return {
    execute: execute
  }
}

module.exports = commander