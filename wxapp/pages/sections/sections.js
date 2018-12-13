const app = getApp()

// pages/sections/sections.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Loading: true, //是否加载
    scrollPage: 0,
    scrollNum: 0, //每次加载的数据量
    sId: 0,
    col1: [],
    col2: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var sectionName=["学习用品", "动植物", "生活美妆", "交通出行", "电子设备", "穿搭"];
    wx.setNavigationBarTitle({
      title: sectionName[options.id],
    })
    //初始化

    this.setData({
      scrollNum: app.globalData.scrollNum,
      scrollPage: 0,
      sId: options.id,
    });


    this.loadImages();

  },
  //加载商品信息

  loadImages: function(options) {
    var scrollPage = this.data.scrollPage;
    var col1 = this.data.col1;
    var col2 = this.data.col2;
    let Loading = this.data.Loading;
    let sId = this.data.sId;
    let scrollNum = this.data.scrollNum;
    var that = this;

    if (!Loading) return;

    wx.request({ //获取json api
      url: app.globalData.requestUrl + 'sections?page=' + scrollPage + '&id=' + sId,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        let images = res.data;
        let baseId = "img-" + (+new Date());

        if (images.length != scrollNum) {
          Loading = false;
        }

        for (let i = 0; i < images.length; i++) {
          images[i].id = baseId + "-" + i;
          if (i % 2 == 0) col1.push(images[i]);
          else col2.push(images[i]);
        }

        that.setData({
          scrollPage: scrollPage + 1,
          Loading: Loading,
          col1: col1,
          col2: col2
        });
      },
      fail:function(){
        that.setData({
          Loading: true,
        })
      }
    });
  },

  onGoodTap: function(e) {
    let _id = e.currentTarget.id;
    wx.navigateTo({
      url: '../good/good?_id=' + _id,
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.data.col1 = [];
    this.data.col2 = [];
    this.data.scrollPage = 0;
    this.data.Loading = true;
    this.loadImages();
  },
  onReachBottom: function () {
    this.loadImages();
  }

})