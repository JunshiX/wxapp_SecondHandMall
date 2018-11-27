// pages/sell/sell.js
Page({

  data: {
    Sections: ["学习用品", "动植物", "生活美妆", "交通出行", "电子设备", "穿搭"], //picker滚动选择器数据列表
    SectionIndex: 0,
    InputLength: 0, //文字输入框字数
    files: [], //图片路径
  },


  onLoad: function(options) {

  },

  //滚动选择器事件监听
  bindSectionChange: function(e) {
    this.setData({
      SectionIndex: e.detail.value
    })
  },

  //统计文本域字数
  bindInput: function(e) {
    var InputLength = e.detail.value.length;
    this.setData({
      InputLength: InputLength,
    })
  },

  //表单验证和提交
  formSubmit: function(e) {
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/; //金额输入验证正则表达式
    var ItemTitle = e.detail.value.ItemTitle;
    var ItemPrice = e.detail.value.ItemPrice;
    var ItemDescription = e.detail.value.ItemDescription;
    var BeforePrice = e.detail.value.BeforePrice;
    var warn = "";
    var flag = false;
    if (!ItemTitle) {
      warn = "请填写标题！";
    } else if (!ItemDescription) {
      warn = "请填写描述！";
    } else if (this.data.files.length == 0) {
      warn = "请上传图片！";
    } else if (!reg.test(ItemPrice)) {
      warn = "请正确填写价格！";
    } else if (!reg.test(BeforePrice)) {
      warn = "请正确填写原价！";
    } else {
      flag = true;
    }

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
      })
    }
  },

  //选择图片
  ChooseImage: function(e) {
    var that = this;
    if (that.data.files.length < 3) {
      wx.chooseImage({
        count: 3, //最多可以选择的图片张数
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表
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
  PreviewImage: function(e) {
    wx.previewImage({
      current: this.data.files[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  //删除已选图片
  DeleteImage: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var files = that.data.files;
    files.splice(index, 1);
    that.setData({
      files: files,
    })
  }

})