//app.js
App({
  onLaunch: function() {
    var that = this;
    //隐藏系统自带tabBar
    wx.hideTabBar();
    that.login();

  },
  //检查登录
  login: function() {
    var that = this;
    //如果已经有sessionId，说明已经登录，直接根据sessionId向第三方服务器请求获取用户信息
    //否则，先获取第三方服务器登录状态，再根据返回的sessionId向第三方服务器请求获取用户信息
    let sessionId;
    if (that.globalData.sessionId == null) sessionId = wx.getStorageSync("sessionId");
    else sessionId = that.globalData.sessionId;

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
      that.globalData.sessionId = sessionId;
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
                that.globalData.sessionId = null;
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
    sessionId: null,
    userInfo: null,
    hasUserInfo: false,
    hasAuth: true,
    Loading: false, //是否加载
    requestUrl: "https://www.clhw.xyz/",
    //requestUrl: "http://127.0.0.1:3000/",
    scrollNum: 20,
    college: ["建筑", "机械", "能环", "信息", "土木", "电子", "数学", "自动化", "计算机", "物理", "生医", "材料", "人文", "经管", "电气", "外国语", "体育", "化工", "交通", "仪科", "艺术", "法", "医", "公卫", "吴健雄", "软件", "微电子", "网安", "其他"],
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