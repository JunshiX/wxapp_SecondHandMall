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
  login: function() {
    var that = this;
    
    //login
    let sessionId = wx.getStorageSync("sessionId");
    if (!sessionId) {
      wx.login({
        success: function(res) {
          var code = res.code;
          if (code) {

            //发送凭证
            wx.request({
              url: that.globalData.requestUrl + 'login',
              data: {
                code: code
              },
              success: function(res) {
                wx.setStorageSync("sessionId", res.data);
                console.log(wx.getStorageSync("sessionId"));
              }
            })

          } else {
            console.log('获取用户登录态失败:' + res.errMsg);
          }
        }
      })
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
    //requestUrl: "https://www.clhw.xyz/",
    requestUrl: "http://127.0.0.1:3000/",
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