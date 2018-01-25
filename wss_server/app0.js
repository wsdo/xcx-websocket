const WebSocketServer = require('websocket').server;
const http = require('http');

let httpServer = http.createServer((request, response) => {
  console.log('['+ (new Date()) +'] request for' + request.url);

  response.writeHead(404);
  response.end();
});

var wsServer = new WebSocketServer({
  httpServer:httpServer,
  autoAcceptConnections:true
})

wsServer.on('connect',(connection) =>{
  connection.on('message',(message)=>{
    console.log('message:',message);
    if(message.type === 'utf8'){
      connection.sendUTF('[from server]');
    }
  });

  connection.on('close',(reasonCode, description) => {
    console.log('disconnected');
  })
})

httpServer.listen(8000,()=>{
  console.log('port 8005');
})
