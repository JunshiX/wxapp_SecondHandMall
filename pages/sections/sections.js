const app = getApp()

// pages/sections/sections.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    json_data:[],
    scrollH: 0, 
    imgWidth: 0,
    imgHeight: 0,
    images: [],
    col1: [],
    col2: [],
    hasGood:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;

    wx.getSystemInfo({
      success: (res) => { //初始化
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.46;
        let imgHeight = imgWidth * 0.69; //设置图片高度
        let scrollH = wh;
        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth,
          imgHeight: imgHeight
        });
      },
    }),
    //请求某分类下的商品
    wx.request({
      //url: 'http://106.14.3.13:3000/sections?id=' + options.id,
      url: 'http://127.0.0.1:3000/sections?id='+options.id,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          json_data: res.data
        })
        that.loadImages();
      },
    })
  },
  //加载商品信息
  loadImages: function () { 
    let images = this.data.json_data;
    let baseId = "img-" + (+new Date());
    let col1 = this.data.col1;
    let col2 = this.data.col2;
    let hasGood=this.data.hasGood;

    if (images.length!=0) hasGood=true;

    for (let i = 0; i < images.length; i++) {
      images[i].id = baseId + "-" + i;
      if (i % 2 == 0) col1.push(images[i]);
      else col2.push(images[i]);
    }

    this.setData({
      hasGood:hasGood,
      images: images,
      col1: col1,
      col2: col2
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onGoodTap: function (e) {
    let _id = e.currentTarget.id;
    wx.navigateTo({
      url: '../goods/goods?_id=' + _id,
    })
  }

})