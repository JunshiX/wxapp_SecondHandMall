// pages/authorize/authorize.js
const app = getApp();

Page({

  data: {
    stuId: "",
    hasStuId:false,
    place: ["九龙湖", "四牌楼"],
    pId: 0,
    college: ["建筑", "机械", "能环", "信息", "土木", "电子", "数学", "自动化", "计算机", "物理", "生医", "材料", "人文", "经管", "电气", "外国语", "体育", "化工", "交通", "仪科", "艺术", "法", "医", "公卫", "吴健雄", "软件", "微电子", "网安", "其他"],
    cId: 0,
  },


  onLoad: function(options) {
    app.login();
    wx.setNavigationBarTitle({
      title: "登录验证"
    });

  },

  //获取学号
  getStuId: function(e) {
    if (e.detail.value!=""){
      this.setData({
        stuId: e.detail.value,
        hasStuId:true
      });
    }else{
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
    let that=this;
    wx.getUserInfo({
      success: function(res) {
        let uName = res.userInfo.nickName,
            uAva=res.userInfo.avatarUrl;
        app.globalData.userInfo = res.userInfo;
        app.globalData.hasUserInfo = true;
        let sessionId=wx.getStorageSync("sessionId");
        
        wx.request({
          url: app.globalData.requestUrl + 'authorize',
          method:'POST',
          data:{
            sessionId:sessionId,
            uName:uName,
            uAva:uAva,
            stuId:that.data.stuId,
            uPlace:that.data.pId,
            uCollege:that.data.cId
          },
          success:function(res){
            console.log(res);
            if (res.statusCode==200) console.log('用户登录成功');
            else console.log(res.data);
            wx.navigateBack();
          },
          fail(){
            console.log("用户信息上传失败");
          }

        })
      },
      fail:function(){
        let currentPage=getCurrentPages();
        console.log(currentPage);
        let delta = currentPage.length-1;
        wx.navigateBack({
          delta:delta
        })
      }
    })
  }
})