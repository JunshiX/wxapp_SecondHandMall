const app = getApp()

let col1H = 0;
let col2H = 0;

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    Loading: false, //上拉加载变量
    LoadingComplete: false, //加载完成
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scrollPage: 0,//控制分页
    scrollNum:8,//每次加载的数据量
    scrollH: 0,//滚动窗口高度
    imgWidth: 0,
    imgHeight: 0,
    col1: [],//左列
    col2: [],//右列
    sections1: [{
        url: "/images/section/s_1.png",
        title: "学习用品",
        idx: 0
      },
      {
        url: "/images/section/s_2.png",
        title: "动植物",
        idx: 1
      },
      {
        url: "/images/section/s_3.png",
        title: "生活美妆",
        idx: 2
      },
    ],
    sections2: [{
        url: "/images/section/s_4.png",
        title: "交通出行",
        idx: 3
      },
      {
        url: "/images/section/s_5.png",
        title: "电子设备",
        idx: 4
      },
      {
        url: "/images/section/s_6.png",
        title: "穿搭",
        idx: 5
      },
    ]

  },

  onLoad: function() {
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
            LoadingComplete: false//初始设置未加载完成
          });
        },
      }),

      this.loadImages(); //加载图片数据
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
    var scrollPage = this.data.scrollPage;
    var col1 = this.data.col1;
    var col2 = this.data.col2;
    let Loading = this.data.Loading;
    let LoadingComplete = this.data.LoadingComplete;
    let scrollNum=this.data.scrollNum;
    var that = this;

    if (LoadingComplete) return;  //如果加载完成则不再进行网络请求
    wx.request({ //获取json api
      url: 'http://127.0.0.1:3000/goods?page=' + scrollPage,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        //console.log(scrollPage);
        let images = res.data;
        //console.log(images);
        let baseId = "img-" + (+new Date());

        if (images.length ==scrollNum) {
          Loading = true;
        } else {//如果返回的数据数目小于每页的预设加载数据量，则代表加载完成
          Loading = false;
          LoadingComplete = true;
        }

        //分列
        for (let i = 0; i < images.length; i++) {
          images[i].id = baseId + "-" + i;
          if (i % 2 == 0) col1.push(images[i]);
          else col2.push(images[i]);
        }

        that.setData({
          scrollPage: scrollPage + 1,//页数自增
          Loading: Loading,
          LoadingComplete: LoadingComplete,
          col1: col1,
          col2: col2
        });
      },
    });
  },

  //点击分类
  onSectionTap: function(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '../sections/sections?id=' + id
    });
  },

  //点击图片
  onGoodTap: function(e) {
    let _id = e.currentTarget.id;
    wx.navigateTo({
      url: '../goods/goods?_id=' + _id,
    })
  }
})