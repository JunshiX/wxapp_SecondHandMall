// pages/authorize/authorize.js
const app = getApp();

Page({

  data: {
    stuId: null,
    location: ["九龙湖", "四牌楼", "丁家桥"],
    locationIndex: 0,
    college: ["建筑", "机械", "能环", "信息", "土木", "电子", "数学", "自动化", "计算机", "物理", "生医", "材料", "人文", "经管", "电气", "外国语", "体育", "化工", "交通", "仪科", "艺术", "法", "医", "公卫", "吴健雄", "软件", "微电子", "网安", "其他"],
    collegeIndex: 0,
  },


  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "登录验证"
    });
  },

  //获取学号
  getStuId: function(e) {
    this.data.stuId = e.detail.value;
  },

  //选择校区
  bindLocation: function(e) {
    this.setData({
      locationIndex: e.detail.value
    })
  },
  //选择学院
  bindCollege: function(e) {
    this.setData({
      collegeIndex: e.detail.value
    })
  },

  //获取用户信息
  getUserInfo: function() {
    //login
    wx.login({
      success: function(res) {
        var code = res.code;
        if (code) {
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo);
              app.globalData.userInfo = res.userInfo;
              app.globalData.hasUserInfo = true;
            }
          })
          console.log(111);
          //发送凭证
          wx.request({
            url: app.globalData.requestUrl + 'login',
            method: 'GET',
            data: {
              code: code,
              uname: app.globalData.userInfo.nickName,
              uavatar: app.globalData.userInfo.avatarUrl,
              lnum:locationIndex,
              cnum:collegeIndex
            },
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {

            }
          })

        } else {
          console.log('获取用户登录态失败:' + res.errMsg);
        }
      }
    })
  }
})