// TRACKER GPRS Server
// - Mobiquity Inc
//   8/5/2015


// 
var TRACKER_LOCATION_MESSAGES = {
  0: "IMEI Header:  <imei_number>                 ",
  1: "Tracker    :  Tracker type                  ",
  2: "Local Date (YY/MM/DD) Local Time (HH/MM/SS) ",
  3: "                                            ",
  4: "F - full / L - low                          ",
  5: "Time UTC (HHMMSS.SSS)                       ",
  6: "Validity                                    ",
  7: "Latitude (DDMM.MMMM)                        ",
  8: "N - North / S- South                        ",
  9: "Longitude (DDDMM.MMMM)                      ",
  10: "E - East / W- West                         ",
  11: "Speed                                      ",  
  12: "Course                                     ",  
  13: "                                           ",
  14: "Altitude                                   ",
};


var net = require('net');
var fs = require('fs');
var util = require('util');

var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'a'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  //log_stdout.write(util.format(d) + '\n');
};

//console.log("\nscript starting");

// Retrieve the port from the --port command line parameter.
// If --port is not specified, return the default port.
function getPort() {
  var argv = process.argv;
  for (var i = 0; i < argv.length; i++) {
    if (argv[i] == '--port') {
      return parseInt(argv[i+1]);
    }
  }
  return 1333;
}

var HOST = '127.0.0.1';
var PORT = 1333;


// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    //console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort+' {');

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        //console.log(util.inspect(data));
//        console.log('<txt>' + data + ' >');
        // Write the data back to the socket, the client will receive it as data from the server

        var toWrite = "LOAD";
        var deviceMsg = data.toString('utf8');
        //console.log(deviceMsg);

        //var arr = deviceMsg.split(",").map(function (val) {
          //return Number(val) + 1;
        //});
        var arr = deviceMsg.split(",");
        //console.log(arr);

        //console.log("position = " + deviceMsg.indexOf("##"));
        //console.log(testarr);
         if(deviceMsg.indexOf("##") >= 0) {
          sock.write(toWrite, function(result) {
                if(result) {
                        //console.log("successful write:"+toWrite);
                } else {
                        //console.log("write failed:"+toWrite);
                }
          });
        } else {
          for (var i = 0; i < 15; i++) {
              console.log('['+i+'] '+TRACKER_LOCATION_MESSAGES[i]+' = '+arr[i]);
            }
        }
    });

    sock.on('drain', function() {
        //console.log('drain\n');
    });

    sock.on('end', function() {
        //console.log('ended\n');
    });

}).listen(PORT, function() {
        //console.log("listen started>>>>" );
});