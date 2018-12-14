// pages/authorize/authorize.js
const app = getApp();

Page({

  data: {
    stuId: "",
    hasStuId: false,
    place: ["九龙湖", "四牌楼"],
    pId: 0,
    college: app.globalData.college,
    cId: 0,
  },


  onLoad: function(options) {
    if (app.globalData.sessionId==null) app.login();
    wx.setNavigationBarTitle({
      title: "登录验证"
    });

  },

  //获取学号
  getStuId: function(e) {
    if (e.detail.value != "") {
      this.setData({
        stuId: e.detail.value,
        hasStuId: true
      });
    } else {
      this.setData({
        hasStuId: false
      });
    }
  },

  //选择校区
  bindPlace: function(e) {
    this.setData({
      pId: e.detail.value
    })
  },
  //选择学院
  bindCollege: function(e) {
    this.setData({
      cId: e.detail.value
    })
  },

  //获取并上传用户信息
  getUserInfo: function() {
    let that = this;
    wx.getUserInfo({
      success: function(res) {
        let uName = res.userInfo.nickName,
          uAva = res.userInfo.avatarUrl;
        let sessionId = wx.getStorageSync("sessionId");

        wx.request({
          url: app.globalData.requestUrl + 'authorize',
          method: 'POST',
          data: {
            sessionId: sessionId,
            uName: uName,
            uAva: uAva,
            stuId: that.data.stuId,
            uPlace: that.data.pId,
            uCollege: that.data.cId
          },
          success: function(res) {
            console.log('用户登录成功');
            let userInfo = {
              uName: uName,
              uAva: uAva,
              uPlace: that.data.pId,
              uCollege: that.data.cId
            };
            app.globalData.userInfo = userInfo;
            app.globalData.hasUserInfo = true;
            app.globalData.hasAuth = true;
            wx.navigateBack();
          },
          fail() {
            console.log("用户信息上传失败");
          }

        })
      },
      fail: function() {
        let currentPage = getCurrentPages();
        console.log(currentPage);
        let delta = currentPage.length - 1;
        wx.navigateBack({
          delta: delta
        })
      }
    })
  }
})