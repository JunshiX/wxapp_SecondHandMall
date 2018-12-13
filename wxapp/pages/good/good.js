const app = getApp();

// pages/goods/goods.js
Page({

  data: {
    gData: {},
    college:app.globalData.college,
    swiperCurrent: 0,
    userInfo: {},
    hasUserInfo: false,
  },

  onLoad: function(options) {
    var that = this;

    wx.showLoading({
      title: '加载中'
    });

    //请求商品和评论信息
    wx.request({
      url: app.globalData.requestUrl + 'good?_id=' + options._id,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideLoading();
        that.setData({
          gData: res.data[0],
        })
      },
    })
  },

  onShow: function() {
    if (app.globalData.userInfo != null) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  //加载评论
  loadComment:function(){
  },
  //滑块视图切换事件
  swiperChange: function(e) {
    if (e.detail.source == 'touch') {
      this.setData({
        swiperCurrent: e.detail.current
      })
    }
  },

  //留言评论
  submitComment:function(){
    if (this.hasUserInfo==false){
      wx.showToast({
        title: '请您先登录！',
        icon: 'none',
        mask: true,
        duration: 2000
      });
    }else{

    }
  }

})