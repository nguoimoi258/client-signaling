// Set RTC options.
/*var rtcOpts = {
    room: 'test-data',
    signaller: 'http://localhost:9090',
    capture:false
};

// call RTC module
var rtc = RTC(rtcOpts);

// A contenteditable element to show our messages
var messages = document.getElementById('messages');

// Bind to events happening on the data channel
function bindDataChannelEvents(id, channel, attributes, connection) {

    // Receive message
    channel.onmessage = function (evt) {
        messages.innerHTML = evt.data;
    };

    // Send message
    messages.onkeyup = function () {
        channel.send(this.innerHTML);
    };
}

// Start working with the established session
function init(session) {
    console.log("init");
    session.createDataChannel('chat', {
          ordered: true,
          maxRetransmits: 12
     });
      session.on('channel:opened:chat', bindDataChannelEvents);
}

// Detect when RTC has established a session
rtc.on('ready', init);
*/

var freeice = require('freeice');
var jwt = require('jsonwebtoken');
var quickconnect = require('rtc-quickconnect');
var config = require('./config');


var token = jwt.sign({name: 'iostreamer'}, config.JWT_SECRETKEY, {
    expiresIn: 15 * 24* 60 * 60 * 1000 // 15 days 
})
var signaling_path = config.SIGNALING_URL +"/token=" + token;

var opts = {
  room: 'qcexample-dctest',
  // debug: true,
  iceServers:freeice()
};

var qc = quickconnect(signaling_path, opts)
  // tell quickconnect we want a datachannel called test
  .createDataChannel('test')
  // when the test channel is open, let us know
  .on('channel:opened:test', function(id, dc) {
    dc.onmessage = function(evt) {
      console.log('peer ' + id + ' says: ' + evt.data);
    };

    console.log('test dc open for peer: ' + id);
    dc.send('hi');
  });