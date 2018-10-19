const app = getApp()

let col1H = 0;
let col2H = 0;

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    scrollH: 0, //瀑布流
    imgWidth: 0,
    imgHeight: 0,
    images: [],
    col1: [],
    col2: [],
    json_data: [],
    sections1: [{
        url: "/images/section/s_1.jpg",
        title: "学习用品",
        idx: 0
      },
      {
        url: "/images/section/s_2.jpg",
        title: "动植物",
        idx: 1
      },
      {
        url: "/images/section/s_3.jpg",
        title: "生活美妆",
        idx: 2
      },
    ],
    sections2: [{
        url: "/images/section/s_4.jpg",
        title: "交通出行",
        idx: 3
      },
      {
        url: "/images/section/s_5.jpg",
        title: "电子设备",
        idx: 4
      },
      {
        url: "/images/section/s_6.jpg",
        title: "穿搭",
        idx: 5
      },
    ]

  },

  onLoad: function() {
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
          imgHeight: imgHeight
        });
      },
    }),

    wx.request({ //获取json api
      url: 'http://127.0.0.1:3000/goods',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          json_data: res.data
        })
        that.loadImages();
      },
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //加载商品信息
  loadImages: function() { 
    let images = this.data.json_data;
    let baseId = "img-" + (+new Date());
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    for (let i = 0; i < images.length; i++) {
      images[i].id = baseId + "-" + i;
      if (i % 2==0) col1.push(images[i]);
      else col2.push(images[i]);
    }

    this.setData({
      images: images,
      col1:col1,
      col2:col2
    });
  },

  onSectionTap: function(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '../sections/sections?id=' + id
    });
  },
})