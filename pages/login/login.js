// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse:wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    var that=this;
    wx.getSetting({
      success:function(res){
        if (res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:function(res){
              //获取用户信息
              that.queryUserInfo();
              //用户已授权
              wx.switchTab({
                url: '',
              })
            }
          })
        }
      }
    })
  }
})