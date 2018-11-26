// pages/sell/sell.js
Page({

  data: {
    Sections: ["学习用品", "动植物", "生活美妆", "交通出行", "电子设备", "穿搭"], //picker滚动选择器数据列表
    SectionIndex: 0,
    InputLength: 0, //文字输入框字数
  },


  onLoad: function(options) {

  },

  bindSectionChange: function(e) {
    this.setData({
      SectionIndex: e.detail.value
    })
  },

  bindInput: function(e) {
    var InputLength = e.detail.value.length;
    this.setData({
      InputLength: InputLength,
    })
  }


})