const app = getApp();

// pages/goods/goods.js
Page({

  data: {
    goodData: {},
  },

  onLoad: function(options) {
    var that = this;

    //请求某分类下的商品
    wx.request({
      url: app.globalData.requestUrl + 'good?_id=' + options._id,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data[0]);
        that.setData({
          goodData: res.data[0],
        })
      },
    })
  },

})