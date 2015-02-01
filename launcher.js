var usb = require('usb')
var _ = require('underscore')

var DEVICE = {
  ID: {
    VENDOR : 0x2123,
    PRODUCT: 0x1010
  },

  CMD: {
    UP   : 0x02,
    DOWN : 0x01,
    LEFT : 0x04,
    RIGHT: 0x08,
    FIRE : 0x10,
    STOP : 0x20
  },

  DURATION : {
    FIRE : 6000
  }
};


var devices = usb.getDeviceList()

var device = usb.findByIds(DEVICE.ID.VENDOR, DEVICE.ID.PRODUCT)
if (device === undefined){
  throw "Missile launcher not found"
}

device.open()

  process.on('exit', device.close)

var interface = device.interface(0)
if (interface.isKernelDriverActive()){
  interface.detachKernelDriver()
}

process.on('exit', interface.release)


var moveLeft =  _.partial(move, DEVICE.CMD.LEFT)
var moveRight = _.partial(move, DEVICE.CMD.RIGHT)
var moveUp =    _.partial(move, DEVICE.CMD.UP)
var moveDown =  _.partial(move, DEVICE.CMD.DOWN)

var stop = _.partial(signal, DEVICE.CMD.STOP)
var fire = _.partial(move, DEVICE.CMD.FIRE, DEVICE.DURATION.FIRE)

function move(cmd, amount,  callback) {
  signal(cmd)

  _.delay(function(){
    stop()
    if(callback)
      callback()
  }, amount)
}

function reset(callback){
  moveLeft(8000, function(){
    moveDown(2000, function(){
      if(callback){
        callback()
      }
    })
  })
}

function signal(cmd) {
  device.controlTransfer(0x21, 0x09, 0x0, 0x0, new Buffer([0x02, cmd, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))  
}

module.exports = {
  left: moveLeft,
  right: moveRight,
  up: moveUp,
  down: moveDown,
  fire: fire,
  reset: reset,
  stop: stop
}