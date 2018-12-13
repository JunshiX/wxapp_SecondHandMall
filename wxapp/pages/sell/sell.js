// pages/sell/sell.js
const app = getApp();
const qiniuUploader = require("../../utils/qiniuUploader.js");

Page({

  data: {
    sections: ["学习用品", "动植物", "生活美妆", "交通出行", "电子设备", "穿搭"], //picker滚动选择器数据列表
    sId: 0,
    inputLength: 0, //文字输入框字数
    files: [], //图片路径
  },

  onLoad: function() {
    app.login();
    let userInfo = app.globalData.userInfo,
      hasUserInfo = app.globalData.hasUserInfo;
    if (!hasUserInfo) {
      wx.redirectTo({
        url: '/pages/authorize/authorize',
      })
    }
  },

  //滚动选择器事件监听
  bindSectionChange: function(e) {
    this.setData({
      sId: e.detail.value
    })
  },

  //统计文本域字数
  bindInput: function(e) {
    var inputLength = e.detail.value.length;
    this.setData({
      inputLength: inputLength,
    })
  },

  //表单验证和提交
  formSubmit: function(e) {
    let that = this;
    let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/; //金额输入验证正则表达式
    let title = e.detail.value.title,
      price = e.detail.value.price,
      describe = e.detail.value.describe,
      oriPrice = e.detail.value.oriPrice;
    let warn = "";
    let flag = false;

    if (!title) warn = "请填写标题！";
    else if (!describe) warn = "请填写描述！";
    else if (this.data.files.length == 0) warn = "请上传图片！";
    else if (!reg.test(price)) warn = "请正确填写价格！";
    else if (!reg.test(oriPrice)) warn = "请正确填写原价！";
    else flag = true;

    if (!flag) {
      wx.showToast({
        title: warn,
        icon: 'none',
        mask: true,
        duration: 2000
      });
    } else {

      wx.showModal({
        title: '提示',
        content: '请检查填写内容，确认发布',
        success: function(res) {
          console.log(that.data.files);
          if (res.confirm) {
            wx.showLoading({
              title: '上传中'
            });

            //上传图片到七牛服务器
            let imgList = [];
            let files = that.data.files;
            for (let i = 0; i < files.length; i++) {
              let filePath = files[i];
              qiniuUploader.upload(filePath, (res) => {
                imgList.push(res.imageURL);
                //所有图片都上传完成将信息存入数据库
                if (imgList.length == files.length) {
                  let sessionId = wx.getStorageSync("sessionId");
                  wx.request({
                    url: app.globalData.requestUrl + 'upload',
                    method: 'POST',
                    data: {
                      sessionId: sessionId,
                      title: title,
                      describe: describe,
                      price: price,
                      oriPrice: oriPrice,
                      sId: that.data.sId,
                      imgList: imgList,
                    },
                    success(res) {
                      console.log("上传成功");
                      app.globalData.Loading=true;
                      wx.hideLoading();
                      wx.navigateBack();
                    },
                    fail() {
                      wx.hideLoading();
                      console.log("上传失败");
                    }
                  })
                }
              }, (error) => {
                console.error('error:' + JSON.stringify(error));
              }, {
                region: 'ECN', // 华东区
                uptokenURL: app.globalData.requestUrl + 'uptoken',
                domain: 'http://res.clhw.xyz',
                shouldUseQiniuFileName: false
              }, (progress) => {
                console.log('上传进度', progress.progress)
                console.log('已经上传的数据长度', progress.totalBytesSent)
                console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
              })
            }
          }
        }
      })
    }
  },


  //选择图片
  chooseImage: function(e) {
    var that = this;
    if (that.data.files.length < 3) {
      wx.chooseImage({
        count: 3, //最多可以选择的图片张数
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表
          console.log(res.tempFilePaths);
          that.setData({
            files: that.data.files.concat(res.tempFilePaths),
          });
        }
      });
    } else {
      wx.showToast({
        title: "图片限传三张！",
        icon: 'none',
        duration: 2000,
        mask: true,
      });
    }
  },

  //预览图片
  previewImage: function(e) {
    wx.previewImage({
      current: this.data.files[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  //删除已选图片
  deleteImage: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var files = that.data.files;
    files.splice(index, 1);
    that.setData({
      files: files,
    })
  }

})