//Dinoku server
let Monitor = require("./monitor");
let monitor = new Monitor();
exports.monitor = monitor;
/*
let World = require('./models/world')
let world = new World()
world.responseTime = 100;
world.startQueueResponse();
exports.world = world;
// */
let server = require('dgt-net').server;
let packet;// = require('./network/packet');
let remoteProxy;// = require('./network/remoteproxy');
///////// Database
let db;
let config = require('./config');
///////// Database

let package = require('./package');
let mongoDB = require("./models/databaseManage");
let port = 21200;
let runningCheck = ["|", "/", "-", "\\"]
let indexRunning = 0;
let status = setInterval(function () {
  indexRunning = ++indexRunning == 4 ? 0 : indexRunning;
  monitor.status("[" + runningCheck[indexRunning] + "] [ Thailand Travel World Server ] {red-fg}::{/red-fg} " + remoteProxy.countClient() +
    " Clients {red-fg}::{/red-fg} " + 0 + "  Player In world");
}, 100);

monitor.info("========================================");
monitor.info("|| King Mongkut University of Technology Thonburi");
monitor.info("|| Thailand Travel World server  ");
monitor.info("|| Server Side v" + package.version);
monitor.info("|| Server port         : " + port);
monitor.info("|| Database Server     : " + config.Database.ip);
monitor.info("========================================");
db = new mongoDB(config.Database,(err) => {  
  if (!err) {
    monitor.log("Database server connection          [{green-fg}OK{/green-fg}]");
  } else {
    monitor.log("Error while connect to database.");
    monitor.log(err);
    monitor.log("Database server connection          [{red-fg}FAILED{/red-fg}]");
    monitor.log("Failed to start server.");
    monitor.log("Press q or ctrl+c to exit ....");
    clearInterval(status);
    return;
  }
});
db.connect().then(()=>{
  monitor.log("Database class create connect       [{green-fg}OK{/green-fg}]");
},()=>{
  monitor.log("Database class create connect       [{red-fg}FAILED{/red-fg}]");
});
exports.db = db;
packet = require('./network/packet');
remoteProxy = require('./network/remoteproxy');
server.setRemoteProxyClass(remoteProxy.RemoteProxy);
server.setPacketObject(packet);
server.listen(port);

monitor.log("             .,-:;//;:=,");
monitor.log("         . :H@@@MM@M#H/.,+%;,");
monitor.log("      ,/X+ +M@@M@MM%=,-%HMMM@X/,");
monitor.log("     -+@MM; $M@@MH+-,;XMMMM@MMMM@+-");
monitor.log("    ;@M@@M- XM@X;. -+XXXXXHHH@M@M#@/.");
monitor.log("  ,%MM@@MH ,@%=            .---=-=:=,.");
monitor.log("  -@#@@@MX .,              -%HX$$%%%+;");
monitor.log(" =-./@M@M$                  .;@MMMM@MM:");
monitor.log(" X@/ -$MM/                    .+MM@@@M$");
monitor.log(",@M@H: :@:                    . -X#@@@@-");
monitor.log(",@@@MMX, .                    /H- ;@M@M=");
monitor.log(".H@@@@M@+,                    %MM+..%#$.");
monitor.log(" /MMMM@MMH/.                  XM@MH; -;");
monitor.log("  /%+%$XHH@$=              , .H@@@@MX,");
monitor.log("   .=--------.           -%H.,@@@@@MX,");
monitor.log("   .%MM@@@HHHXX$$$%+- .:$MMX -M@@MM%.");
monitor.log("     =XMMM@MM@MM#H;,-+HMM@M+ /MMMX=");
monitor.log("       =%@M@M#@$-.=$@MM@@@M; %M%=");
monitor.log("         ,:+$+-,/H#MMMMMMM@- -,");
monitor.log("               =++%%%%+/:-.");

