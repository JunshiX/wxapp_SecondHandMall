// pages/authorize/authorize.js
Page({

  data: {

  },

  bindGetUserInfo: function(e) {
    //获取最新的用户信息
    console.log(e.detail);
    if (!e.detail.userInfo) {
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo);
    this.checkSessionAndLogin();
  },
  /* 
      这里使用openid 作为与后端session 连接的标志
      检查是否存在openid，即之前是否登录过
      如果登录过，检查session_key 是否过期
      如果过期了，remove openid 重新执行login 并将用户信息发送到服务器端更新
      如果没过期则返回
      如果没登录过则执行login 并将用户信息发送到服务器更新
  */

  checkSessionAndLogin: function() {
    let that = this;
    let thisOpenId = wx.getStorageSync('openid');

    //已经进行了登录，检查登录是否过期
    if (thisOpenId) {
      wx.checkSession({
        success: function() {
          //session_key未过期，并且在本生命周期一直有效
          wx.navigateBack({});
        },
        fail: function() {
          //session_key已经失效，需要重新执行登录流程
          wx.removeStorageSync('openid');
          that.checkSessionAndLogin();
        }
      })
    } else {
      //没有进行登录则先进行登录操作
      that.loginAndGetOpenid();
    }
  },

  //执行登录操作并获取用户openId
  loginAndGetOpenid: function() {
    let that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.request({
            url: 'requestUrl',
            data: {
              code: res.code
            },
            success: function(res1) {
              res = res.data;
              //保存openid，并将用户的信息发送给后端
              if (res.code === 0) {
                wx.showModal({
                  title: 'set openid',
                  content: res.data,
                })
                wx.setStorageSync('openid', res.data);
                that.sendUserInfoToServer();
              } else {
                wx.showModal({
                  title: 'sorry',
                  content: '用户登录失败',
                })
              }
            }
          })
        }
      }
    })
  },

  sendUserInfoToServer:function(){
    let userInfo=wx.getStorageSync('uerInfo');
    let thisOpenId=wx.getStorageSync('openid');
    userInfo.openid=thisOpenId;
    wx.request({
      url: 'requestUrl',
      method:'POST',
      dataType:'json',
      data:userInfo,
      success:function(res){
        res=res.data;
        if (res.code===0){
          wx.navigateBack({});
        }else{
          wx.showModal({
            title:'sorry',
            content:'同步信息出错',
          })
        }
      }
    })
  }
})