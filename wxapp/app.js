//app.js
App({
  onLaunch: function() {
    var that = this;
    //隐藏系统自带tabBar
    wx.hideTabBar();
    that.login();

    //获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        that.globalData.windowWidth = res.screenWidth;
        that.globalData.windowHeight = res.screenHeight;
      },
    });

  },
  //检查登录
  login: function() {
    var that = this;
    //如果已经有sessionId，说明已经登录，直接根据sessionId向第三方服务器请求获取用户信息
    //否则，先获取第三方服务器登录状态，再根据返回的sessionId向第三方服务器请求获取用户信息
    let sessionId = wx.getStorageSync("sessionId");

    if (!sessionId) {
      wx.login({
        success: function(res) {
          if (res.code) {
            //发送凭证
            wx.request({
              url: that.globalData.requestUrl + 'login',
              data: {
                code: res.code
              },
              success: function(res) {
                wx.setStorageSync("sessionId", res.data);
                that.getUserInfo(res.data);
              },
            })
          } else {
            console.log('获取用户登录态失败:' + res.errMsg);
          }
        }
      })
    } else {
      that.getUserInfo(sessionId);
    }
  },
  //向第三方服务器获取用户信息
  getUserInfo: function(param) {
    let that = this;
    if (that.globalData.hasUserInfo == false) {
      if (that.globalData.hasAuth === true) {
        wx.request({
          url: that.globalData.requestUrl + 'getUserInfo',
          data: {
            sessionId: param
          },
          success: function(res) {
            if (res.statusCode == 404) {
              if (res.data.error == 0) {
                console.log("服务器session失效");
                wx.removeStorageSync("sessionId");
                that.login();
              } else {
                console.log("当前用户未授权使用个人信息");
                that.globalData.hasAuth = false;
              }
            } else if (res.statusCode == 200) {
              that.globalData.userInfo = res.data;
              that.globalData.hasUserInfo = true;
            }
          }
        })
      }
    }

  },

  //自定义tabbar组件
  editTabbar: function() {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  //全局变量
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    hasAuth: true,
    requestUrl: "https://www.clhw.xyz/",
    //requestUrl: "http://127.0.0.1:3000/",
    scrollNum: 100,
    windowHeight: null,
    windowWidth: null,
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#E74552",
      "list": [{
          "pagePath": "/pages/index/index",
          "iconPath": "icon/home.png",
          "selectedIconPath": "icon/home_selected.png",
          "text": "我要买"
        },
        {
          "pagePath": "/pages/sell/sell",
          "iconPath": "icon/icon_release.png",
          "isSpecial": true,
          "text": ""
        },
        {
          "pagePath": "/pages/mine/mine",
          "iconPath": "icon/mine.png",
          "selectedIconPath": "icon/mine_selected.png",
          "text": "我的"
        }
      ]
    }
  }
})