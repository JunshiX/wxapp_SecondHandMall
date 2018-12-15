const app = getApp();

// pages/goods/goods.js
Page({

  data: {
    cmtAt: '询问更多，欢迎留个言',
    cmtAtName: null,
    cmtAtId: null,
    cmt: null,
    gId: null,
    gData: {},
    cmtData: {},
    college: app.globalData.college,
    swiperCurrent: 0,
    userInfo: {},
    hasUserInfo: false,
  },

  onLoad: function(options) {
    var that = this;
    that.data.gId = options._id;

    wx.showLoading({
      title: '加载中'
    });

    //请求商品和评论信息
    wx.request({
      url: app.globalData.requestUrl + 'good',
      data: {
        _id: options._id
      },
      success: function(res) {
        wx.hideLoading();
        that.setData({
          gData: res.data.gData,
          cmtData: res.data.cmtData,
        })

      },
    });

  },

  onShow: function() {
    if (app.globalData.userInfo != null) {
      if (this.data.hasUserInfo == false) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      }
    }
  },

  //加载评论
  loadComment: function() {
    let that = this;
    wx.request({
      url: app.globalData.requestUrl + 'comment',
      data: {
        gId: that.data.gId
      },
      success: function(res) {
        that.setData({
          cmtData: res.data,
        })
      },
    })
  },
  //滑块视图切换事件
  swiperChange: function(e) {
    if (e.detail.source == 'touch') {
      this.setData({
        swiperCurrent: e.detail.current
      })
    }
  },

  //留言评论
  submitComment: function() {
    let that = this;
    if (that.data.hasUserInfo == false) {
      wx.showToast({
        title: '请您先登录！',
        icon: 'none',
        mask: true,
        duration: 2000
      });
    } else {
      let gData = that.data.gData,
        sessionId = app.globalData.sessionId,
        cuId = gData.uId,
        cuName = gData.uName;
      //评论回复其他买家，否则认为回复卖家
      if (that.data.cmtAtId != null) {
        cuId = that.data.cmtAtId;
        cuName = that.data.cmtAtName;
      }
      wx.request({
        url: app.globalData.requestUrl + 'submitCmt',
        method: 'POST',
        data: {
          gId: that.data.gId,
          sessionId: sessionId,
          cuId: cuId,
          cuName: cuName,
          cmt: that.data.cmt
        },
        success: function(res) {
          //评论成功就将留言置空
          wx.showToast({
            title: '留言成功！',
            icon: 'none',
            mask: true,
            duration: 2000
          });
          that.setData({
            cmt: null
          })

        },
      });
      that.loadComment();
    }
  },

  //点击评论指定回复
  commentAt: function(e) {
    this.setData({
      cmtAt: '回复@' + e.currentTarget.dataset.name,
      cmtAtName: e.currentTarget.dataset.name,
      cmtAtId: e.currentTarget.dataset.uid
    })
  },
  //预览图片
  previewImage: function(e) {
    wx.previewImage({
      current: this.data.gData.imgList[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.gData.imgList // 需要预览的图片http链接列表
    })
  },

  inputChange: function(e) {
    this.data.cmt = e.detail.value;
  }

})