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
    app.login();
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

    wx.getUserInfo({
      success: function(res) {
        console.log(res);
        app.globalData.userInfo = res.userInfo;
        app.globalData.hasUserInfo = true;
        wx.navigateBack();
      },
      fail:function(){
        let currentPage=getCurrentPages();
        let delta=0;
        if (currentPage.length==3) delta=2;
        else delta=1;
        wx.navigateBack({
          delta:delta
        })
      }
    })
  }
})