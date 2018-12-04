// pages/mine/mine.js
const app=getApp();

Page({
  data: {
    userInfo:{},
    hasUserInfo:false,
    tabbar:{},
    mine1:[{id:1,name:"我的消息"},{id:2,name:"我的收藏"},{id:3,name:"我的发布"}],
    mine2:[{id:4,name:"防骗指南"},{id:5,name:"用户协议"},{id:6,name:"关于我们"}],
  },

  onLoad: function (options) {
    app.editTabbar();
    app.login();

  },

  onShow: function () {
    if (app.globalData.userInfo != null) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  bindLogin:function(){
    wx.navigateTo({
      url: '/pages/authorize/authorize',
    })
  }

})