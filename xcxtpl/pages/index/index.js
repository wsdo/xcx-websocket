//index.js
//获取应用实例
var app = getApp()
var socketOpen = false
var socketMsgQueue = []
Page({
  data: {
    userInfo: {},
    socktBtnTitle: '连接socket',
    imgUrls: [
      '//gqianniu.alicdn.com/bao/uploaded/i4//tfscom/i1/TB1n3rZHFXXXXX9XFXXXXXXXXXX_!!0-item_pic.jpg_320x320q60.jpg',
      '//gqianniu.alicdn.com/bao/uploaded/i4//tfscom/i4/TB10rkPGVXXXXXGapXXXXXXXXXX_!!0-item_pic.jpg_320x320q60.jpg',
      '//gqianniu.alicdn.com/bao/uploaded/i4//tfscom/i1/TB1kQI3HpXXXXbSXFXXXXXXXXXX_!!0-item_pic.jpg_320x320q60.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    loop : false,
  },
  changeIndicatorDots: function(e) {
   this.setData({
     indicatorDots: !this.data.indicatorDots
   })
 },
 changeAutoplay: function(e) {
   this.setData({
     autoplay: !this.data.autoplay
   })
 },
 intervalChange: function(e) {
   this.setData({
     interval: e.detail.value
   })
 },
 durationChange: function(e) {
   this.setData({
     duration: e.detail.value
   })
 },
 schange: function(e) {
   console.log(e.detail.current);
   // this.sendSocketMessage({current:e.detail.current,content:'当前的轮播图index')
   this.sendSocketMessage(e.detail.current)
 },
  socketBtnTap: function () {
    var that = this
    var remindTitle = socketOpen ? '正在关闭' : '正在连接'
    wx.showToast({
      title: remindTitle,
      icon: 'loading',
      duration: 10000
    })
    if (!socketOpen) {
      wx.connectSocket({
        url: 'wss://stark.ngrok.wdevelop.cn'
      })
      wx.onSocketError(function (res) {
        socketOpen = false
        console.log('WebSocket连接打开失败，请检查！',res)
        that.setData({
          socktBtnTitle: '连接socket'
        })
        wx.hideToast()
      })
      wx.onSocketOpen(function (res) {
        console.log('WebSocket连接已打开！')
        wx.hideToast()
        that.setData({
          socktBtnTitle: '断开socket'
        })
        socketOpen = true
        for (var i = 0; i < socketMsgQueue.length; i++) {
          that.sendSocketMessage(socketMsgQueue[i])
        }
        socketMsgQueue = []
      })
      wx.onSocketMessage(function (res) {
        console.log('收到服务器内容：' + res.data)
      })
      wx.onSocketClose(function (res) {
        socketOpen = false
        console.log('WebSocket 已关闭！')
        wx.hideToast()
        that.setData({
          socktBtnTitle: '连接socket'
        })
      })
    } else {
      wx.closeSocket()
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  sendSocketMessage: function (msg) {
    if (socketOpen) {
      wx.sendSocketMessage({
        data: msg
      })
    } else {
      socketMsgQueue.push(msg)
    }
  },
  sendMessageBtnTap: function () {
    this.sendSocketMessage('welcome stark')
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})
