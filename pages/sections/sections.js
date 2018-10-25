const app = getApp()

// pages/sections/sections.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Loading: false, //上拉加载变量
    LoadingComplete: false, //加载完成
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scrollPage: 0,
    scrollH: 0,
    scrollNum: 8,//每次加载的数据量
    imgWidth: 0,
    imgHeight: 0,
    sectionsId:0,
    col1: [],
    col2: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

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
            imgHeight: imgHeight,
            scrollPage: 0,
            sectionsId:options.id,
          });
        },
      }),
    
      this.loadImages();
    
  },
  //加载商品信息

  loadImages: function(options) {
    var scrollPage = this.data.scrollPage;
    var col1 = this.data.col1;
    var col2 = this.data.col2;
    let Loading = this.data.Loading;
    let LoadingComplete = this.data.LoadingComplete;
    let sectionsId=this.data.sectionsId;
    let scrollNum=this.data.scrollNum;
    var that = this;

    if (LoadingComplete) return;

    wx.request({ //获取json api
      url: 'http://127.0.0.1:3000/sections?page=' + scrollPage + '&id=' + sectionsId,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(scrollPage);
        let images = res.data;
        console.log(images);
        let baseId = "img-" + (+new Date());

        if (images.length == scrollNum) {
          Loading = true;
        } else {
          Loading = false;
          LoadingComplete = true;
        }

        for (let i = 0; i < images.length; i++) {
          images[i].id = baseId + "-" + i;
          if (i % 2 == 0) col1.push(images[i]);
          else col2.push(images[i]);
        }

        that.setData({
          scrollPage: scrollPage + 1,
          Loading: Loading,
          LoadingComplete: LoadingComplete,
          col1: col1,
          col2: col2
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onGoodTap: function(e) {
    let _id = e.currentTarget.id;
    wx.navigateTo({
      url: '../goods/goods?_id=' + _id,
    })
  }

})