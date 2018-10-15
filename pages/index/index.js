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
    loadingCount: 0,
    images: [],
    img_avatars:[],
    col1: [],
    col2: [],
    sections1:[
      { url: "/images/section/s_1.jpg", title: "学习用品",idx:0 },
      { url: "/images/section/s_2.jpg", title: "动植物" ,idx:1},
      { url: "/images/section/s_3.jpg", title: "生活美妆" ,idx:2},
    ],
    sections2: [
      { url: "/images/section/s_4.jpg", title: "交通出行" ,idx:3},
      { url: "/images/section/s_5.jpg", title: "电子设备" ,idx:4},
      { url: "/images/section/s_6.jpg", title: "穿搭" ,idx:5},
    ]

  },

  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: (res) => {         //初始化
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.46;
        let scrollH = wh;
        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });
        this.loadImages();
      }
    })
    
    wx.request({                //获取json api
      url: 'http://127.0.0.1:3000/goods',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          json_data: res.data
        })
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

  onImageLoad: function(e) {          //图片分栏
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    let imgHeight=imgWidth*0.69;//设置图片高度
    

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;
    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (loadingCount==0) {
      data.images = [];
    }

    this.setData(data);
  },

  loadImages: function() {      //加载资源
    //let images=[];
    //for (let i=0;i<json_data.length;i++){

    //}
    let images = [
      {pic: "../../images/1.jpg",height: 0},
      {pic: "../../images/2.jpg",height: 0},
      {pic: "../../images/3.jpg",height: 0},
      {pic: "../../images/4.jpg",height: 0},
    ];

    let baseId = "img-" + (+new Date());

    for (let i = 0; i < images.length; i++) {
      images[i].id = baseId + "-" + i;
    }

    this.setData({
      loadingCount: images.length,
      images: images
    });
  },

  onSectionTap: function(){
    wx.navigateTo({
      url: '../sections/sections'
    })
  },
})