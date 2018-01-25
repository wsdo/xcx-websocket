const WebSocket = require('ws');
const util = require("util");
const wss = new WebSocket.Server({ port: 3005 });
console.log("WebSocket服务端已启动。");

wss.on('connection', function connection(socket) {
    console.log("有新客户端连接!");

    // 构造客户端对象
    var newclient = {
        socket:socket,
        name:false
    };

    socket.on('message', function incoming(msg) {
        var currentTime = getTime();
        // 判断是不是第一次连接，以第一条消息作为用户名
        if(!newclient.name){
            newclient.name = msg;
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send("welcome_系统管理员_" + currentTime + "_欢迎" + msg + "加入聊天！");
                }
            });
            console.log(newclient.name + "加入聊天。");
        }
        else{
            wss.clients.forEach(function each(client) {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send(msg);
                }
                else if(client == socket){
                    client.send(msg);
                }
                console.log(newclient.name + "于" + currentTime + "说：" + msg);
            });
        }
    });

    socket.on('close', function close() {
      console.log('小程序断开wss');
        // var currentTime = getTime();
        // wss.clients.forEach(function each(client) {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send("leave_系统管理员_" + currentTime + "_" + newclient.name + "离开聊天！");
        //     }
        //     console.log(newclient.name + "离开聊天。");
        // });
    });
});

var getTime=function(){
  var date = new Date();
  return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
};
