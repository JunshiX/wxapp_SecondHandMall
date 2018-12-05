const app=getApp();

// pages/goods/goods.js
Page({

  data: {
    json_data: {},
  },

  onLoad: function(options) {
    var that = this;

    wx.getSystemInfo({
        success: (res) => {},
      }),
      //请求某分类下的商品
      wx.request({
        url: app.globalData.requestUrl + 'good?_id=' + options._id,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          that.setData({
            json_data: res.data
          })
        },
      })
  },

})