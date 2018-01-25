(function($){
    console.log("将要连接服务器。");
    var wsUri ="ws://stark.ngrok.wdevelop.cn";
    var socketOpen = false;
    var messageArray = [];
    var mySwiper = new Swiper('.swiper-container',{
      initialSlide :0,
      // loop : true,
      on: {
        slideChangeTransitionEnd: function(){
          console.log('pc端index：',this.activeIndex);//切换结束时，告诉我现在是第几个slide
        },
      },
      // autoplay: true,//可选选项，自动滑动
    })

    $('#btn').click(function(){
      mySwiper.slideTo(2, 1000, false);//切换到第一个slide，速度为1秒
    })
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(res) {
        console.log("连接服务器成功。");
        $("#inputMessage").attr("placeholder","连接服务器成功，请输入姓名。");
        socketOpen = true;
    };
    websocket.onclose = function(res) {
        console.log("断开连接。");
    };
    websocket.onmessage = function(res) {
        console.log('轮播图id为：' + res.data);
        mySwiper.slideTo(res.data, 1000, false)//切换到第一个slide，速度为1秒
    };

    websocket.onerror = function(res) {
        console.log("连接错误。");
    };

    $("#sendButton").on("click",function () {
        var message = $("#inputMessage").val();
        if(message!=''){
            $("#inputMessage").attr("placeholder","请输入信息");
            sendSocketMessage(message);
            $("#inputMessage").val("");
        }
    });

    function sendSocketMessage(message) {
        if(socketOpen){
            websocket.send(message);
        }
    }
})(Zepto);
