
// pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
//   if (err) { //if an error
//     console.error('There was an error', err); //output error message to console
//   return;
//   }
//   LED.writeSync(value); //turn LED on or off depending on the button state (0 or 1)
// });

// function unexportOnClose() { //function to run when exiting program
//   LED.writeSync(0); // Turn LED off
//   LED.unexport(); // Unexport LED GPIO to free resources
//   pushButton.unexport(); // Unexport Button GPIO to free resources
// };

// process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c


// var server = require('http').createServer(app);
//     var io = require('socket.io').listen(server);


var server = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = socketIO(server);//require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED04 = new Gpio(4, 'out'); //use GPIO pin 4 as output
var LED06 = new Gpio(6, 'out'); //use GPIO pin 4 as output
var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
//Put all the LED variables in an array
var leds = [LED04, LED06];
var indexCount = 0; //a counter

server.listen(process.env.PORT || 3000, function(){
  console.log('Server started');
});


// server.listen(process.env.PORT || 3000);
// http.listen(8080); //listen to port 8080

function handler (req, res) { //create server
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
  var lightvalue = 0; //static variable for current status
  pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    lightvalue = value;
    socket.emit('light', lightvalue); //send button status to client
  });
  socket.on('light', function(data) { //get light switch status from client
    lightvalue = data;
    leds.forEach((l,e) => {
      console.log(l);
      if (lightvalue != l.readSync()) { //only change LED if status has changed
        l.writeSync(lightvalue); //turn LED on or off
      }
    });
  });
});

process.on('SIGINT', function () { //on ctrl+c
  leds.forEach((l,e) => {
    l.writeSync(0); // Turn LED off
    l.unexport(); // Unexport LED GPIO to free resources
    pushButton.unexport(); // Unexport Button GPIO to free resources
    process.exit(); //exit completely
  });
});

