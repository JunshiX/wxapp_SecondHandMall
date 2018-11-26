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
  },

  formSubmit: function(e) {
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
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
    } else if (!reg.test(ItemPrice)) {
      warn = "请正确填写价格！";
    } else if (!reg.test(BeforePrice)) {
      warn = "请正确填写原价！";
    } else {
      flag = true;
    }

    if (!flag){
      wx.showModal({
        title: '提示',
        content: warn,
      });
  } else {
    wx.showModal({
      title: '提示',
      content: "发布成功",
    });
  }
}

})