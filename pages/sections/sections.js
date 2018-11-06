const app = getApp()

// pages/sections/sections.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Loading: true, //是否加载
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scrollPage: 0,
    scrollH: 0,
    scrollNum: 0, //每次加载的数据量
    imgWidth: 0,
    imgHeight: 0,
    sectionsId: 0,
    col1: [],
    col2: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: options.id,
    })
    //初始化
    let ww = app.globalData.windowWidth;
    let imgWidth = ww * 0.46;
    let imgHeight = imgWidth * 0.69; //设置图片高度
    let scrollH = app.globalData.windowHeight;
    this.setData({
      scrollNum: app.globalData.scrollNum,
      scrollH: scrollH,
      imgWidth: imgWidth,
      imgHeight: imgHeight,
      scrollPage: 0,
      sectionsId: options.id,
    });


    this.loadImages();

  },
  //加载商品信息

  loadImages: function(options) {
    var scrollPage = this.data.scrollPage;
    var col1 = this.data.col1;
    var col2 = this.data.col2;
    let Loading = this.data.Loading;
    let sectionsId = this.data.sectionsId;
    let scrollNum = this.data.scrollNum;
    var that = this;

    if (!Loading) return;

    wx.request({ //获取json api
      url: app.globalData.requestUrl + 'sections?page=' + scrollPage + '&id=' + sectionsId,
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
      url: '../goods/goods?_id=' + _id,
    })
  },

})