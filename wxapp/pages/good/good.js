const app = getApp();

// pages/goods/goods.js
Page({

  data: {
    gData: {},
    swiperCurrent: 0,
    userInfo: {},
    hasUserInfo: false,
  },

  onLoad: function(options) {
    var that = this;

    wx.showLoading({
      title: '加载中'
    });

    //请求某分类下的商品
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

  //滑块视图切换事件
  swiperChange: function(e) {
    if (e.detail.source == 'touch') {
      this.setData({
        swiperCurrent: e.detail.current
      })
    }
  },
  bindLogin:function(){
    wx.navigateTo({
      url: '/pages/authorize/authorize',
    })
  }

})