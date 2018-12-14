# 微信小程序设计日志  

## **目录**

- [设计说明](#设计说明)
- 前端部分
  - [Template的使用](#Template的使用)
  - [小程序的页面跳转和传值](#小程序的页面跳转和传值)
  - [自定义tabBar组件（component）](#自定义tabBar组件（component）)
  - [自定义轮播图dots样式](#自定义轮播图dots样式)
  - [表单的布局](#表单的布局)
    - [Flex布局](#Flex布局)
    - [picker滚动选择器](#picker滚动选择器)
    - [textarea文本字数限定](#textarea文本字数限定)
    - [表单数据验证](#表单数据验证)
    - [伪元素实现上传图片的预览以及删除](#伪元素实现上传图片的预览以及删除)
- 后端部分
  - [Mongoose的model和Schema](#Mongoose的model和Schema)
  - [存储表的设计](#存储表的设计)
  - [小程序的性能优化](#小程序的性能优化)
  - [Express的路由分离](#Express的路由分离)
  - [RESTfulAPI接口](#RESTfulAPI接口)
  - [数据的分页加载](#数据的分页加载)
  - [小程序的登录态和用户信息管理](#小程序的登录态和用户信息管理)
  - [七牛云对象存储](#七牛云对象存储)
  - [小程序的上拉刷新和下拉加载](#小程序的上拉刷新和下拉加载)
- [环境部署](https://github.com/chenxing1020/wxapp_SecondHandMall/blob/master/Environment.md)



---
## **设计说明**
>参考文档：  
>1.Node.js入门经典2013版  
>2.[阮一峰的网络日志：理解RESTful架构](http://www.ruanyifeng.com/blog/2011/09/restful.html)    

&emsp;&emsp;本次小程序的开发采用前后端分离的思想。  
* 前端直接使用小程序官方的**WXML+WXSS+JS**框架。小程序框架如下：
```
─images //图片资源
│  └─...
├─pages //视图资源
│  └─...
├─component //自定义组件
│  └─...
├─template  //模板资源
│  └─...
└─utils //工具
```  
* 后端利用**NodeJS**的**Express**框架，创建基于**JSON**(JavaScript Object Notation)的**RESTful**(Representational State Transfer) API，使软件能和服务交互。  
API应具备如下功能：  
  1. 能够创建、更新、删除和读取数据。
  2. 数据储存在**MongoDB**中。  

[返回目录](#目录)

---
## **Mongoose的model和Schema** 

&emsp;&emsp;**Schema**主要用于定义MongoDB中集合Collection里文档document的结构，通过`mongoose.Schema`来调用Schema，然后使用new方法来创建schema对象.
```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mySchema = new Schema({
  // value
});
```
&emsp;&emsp;模型**Model**是根据Schema编译出的构造器，或者称为类，通过Model可以实例化出文档对象document,文档document的创建和检索都需要通过模型Model来处理。使用`model()`方法，将Schema编译为Model。  
&emsp;&emsp;`model()`方法的第一个参数是模型名称。Mongoose会将集合名称设置为模型名称的小写版。如果名称的最后一个字符是字母，则会变成复数；如果名称的最后一个字符是数字，则不变；如果模型名称为"MyModel"，则集合名称为"mymodels"；如果模型名称为"Model1"，则集合名称为"model1"。
```javascript
//注意：一定要将模型名称与返回值一致，否则会出现一些错误。即 a=mongoose.model('a',schema);
//在下面这个例子中，生成的集合名称为mymodels
var MyModel = mongoose.model('MyModel', schema); 
```

[返回目录](#目录)

---
## **Express的路由分离**
>参考文档：[express框架的路由模块化](https://www.cnblogs.com/lewis-messi/p/9087258.html)  

&emsp;&emsp;路由是由一个**URL**和一个特定的**HTTP**方法（GET、POST等）组成的，它涉及到应用如何响应客户端对某个资源的访问。  
&emsp;&emsp;在使用Express写代码的过程中，会根据类别，将路由分为多个不同的文件，然后在项目的入口文件（例如app.js）中将其依次挂载，例如：
```javascript
var index=require('./routes/index'),
    user=require('./routes/user');
app.use('/',index);
app.use('/user',user);
```
&emsp;&emsp;但是随着项目的不断完善，一个后端程序会提供很多的数据接口，即会配置很多不同的路由，如果将这些功能接口都放在项目的入口文件里，会使得程序变得臃肿且难以维护，所以需要将路由分离进行管理。  
&emsp;&emsp;因为数据接口需要执行的操作主要是**CRUD**，所以很自然的想到分模块来管理，项目结构如下：
```
├─server
│  │  app.js
│  │  package.json
│  ├─models
│  │      model.js
│  └─routes
│          delete.js
│          insert.js
│          query.js
│          update.js
```
&emsp;&emsp;在routes文件夹下，query.js、insert.js、update.js、delete.js分别对应GET、POST、PUT、DELETE这四个HTTP动词。
```javascript
//query.js
var express = require('express'),
var router = express.Router();
router.get('/...', function (req,res) {
  //function
});
router.get('/...', function (req,res) {});
...
module.exports = router;
```
&emsp;&emsp;在对路由模块化后，需要在程序入口将这些路由关联起来。
```javascript
//app.js
var queryRouter=require('./routes/query'),
    insertRouter=require('./routes/insert'),
    delRouter=require('./routes/delete'),
    updateRouter=require('./routes/update');
app.use('/',queryRouter);
app.use('/',insertRouter);
app.use('/',delRouter);
app.use('/',updateRouter);
```
**注**：`app.use(path,callback)`中的`callback`既可以是`router`对象也可以是函数，但是`app.get(path,callback)`中的`callback`只能是函数。`router`代表一个由`express.Router()`创建的对象，在路由对象中可以定义多个路由规则。


[返回目录](#目录)

---
## **RESTfulAPI接口**
&emsp;&emsp;首先新建服务器工程,安装完依赖之后在app.js中写入路由对应的方法操作.
```javascript
app.listen(3000);
app.get('/tasks',function(req,res,next){
    taskModel.find({},function(err,docs){
        res.json(docs);
    });
});
```
&emsp;&emsp;然后在微信小程序中使用`wx.request`访问这个api(注意由于小程序不能使用端口访问，所以本地测试的时候需要勾选不校验合法域名、web-view、TLS版本以及HTTPS证书选项).
```javascript
onLoad: function () {
    var that=this;
    wx.request({
      url: 'http://127.0.0.1:3000/tasks',
      method:'GET',
      header:{
        'content-type':'application/json'
      },
      success:function(res){
        that.setData({
          json_data:res.data
        })
      },
    })
  },
```
**注意**：由于`wx.request`方法之后会生成新的对象，所以要想传值给page的初始数据，需要在刚开始将this对象赋值给一个that对象。

[返回目录](#目录)

---
## **数据的分页加载**  
>参考文档：  
>1.[Mongoose分页查询优化](https://www.cnblogs.com/fayin/p/7028466.html)  
>2.[微信小程序之加载更多(分页加载)实例](https://blog.csdn.net/michael_ouyang/article/details/56846185)  
>3.[微信小程序中使用wxss加载图片并实现动画](https://blog.csdn.net/yaodong379/article/details/78848072?_u_u_u=0.19657183531671762)  

&emsp;&emsp;随着后端的数据量越来越大，在前端和后端交互的过程中，一次性返回所有数据会使得页面的打开速度有所下降，同时也增大了前端渲染的难度，而且实际上用户只需要看到页面的部分数据而不需要看到所有的数据，所以需要对数据进行分页。

### **后端处理**  
&emsp;&emsp;分页的方案大概有三种：前端分页、后端分页以及数据库查询分页。很显然由于数据库查询的性能是优于前端和后端操作数据的性能，所以在后端直接采用**mongoose**的查询分页，利用`skip`和`limit`来进行分页，在前端传入当前视图的页数和每一页的最大数据长度，从而在每次查询只返回局部的数据量，从而实现分流。
```js
//后端查询语句
goodModel.find({}, function (err, docs) {
  res.json(docs);
}).limit(pageNum).skip(scrollPage*pageNum);
```
### **前端处理**  
&emsp;&emsp;处理完后端的数据之后，还需要在前端实现对数据的渲染，基本的实现如下：  
&emsp;&emsp;设置`Loading`参数分别来控制“是否加载数据”，设置`scrollPage`和`scrollNum`两个参数来控制当前视图的页数以及每一页最大数据量。
```js
//index.js
onLoad: function() {
  this.setData({
    scrollPage: 0,
    Loading: true //默认加载
  });
  this.loadImages(); //加载图片数据
},
```
&emsp;&emsp;初始化结束后，调用加载函数，这里需要搞清`Loading`参数的逻辑状态：  
&emsp;&emsp;当每次返回的数据长度和单页最大数据量相等的时候（即使下一次查询的返回数据长度可能为0，只是会多出一次无效查询），说明“继续加载”的状态是仍然可以持续的，当列表滚动到底部的时候，继续往上拉，就加载更多的内容。  
&emsp;&emsp;当返回的数据长度小于单页最大数据量的时候（初始没有数据的时候返回空数据也属于这种状态），说明此时后端数据已经都查询完毕，即达成“加载已完成”的状态，此后不需要再访问api。
```javascript
//index.js
loadImages: function() {
    var scrollPage = this.data.scrollPage;
    let Loading = this.data.Loading;
    let scrollNum=this.data.scrollNum;
    var that = this;
    if (!Loading) return;  //如果加载完成则不再进行网络请求
    wx.request({
      url: '...?page=' + scrollPage,
      method: 'GET',
      header: {'content-type':'application/json'},
      success: function(res) {
        let images = res.data;
        if (images.length != scrollNum) { //如果返回的数据数目小于每页的预设加载数据量，则代表加载完成
          Loading = false;
        }
        that.setData({
          scrollPage: scrollPage + 1,//页数自增
          Loading: Loading
        });
      },
    });
  },
```
```html
//index.wxml
<scroll-view scroll-y="true" bindscrolltolower="loadImages" lower-threshold="50rpx">
  ...
  <view wx:if="{{Loading}}">
    <image class="loading" src=""></image>
    <text>正在载入更多...</text>
  </view>
  <view wx:if="{{!Loading}}">
    <text>已加载全部</text>
  </view>
</scroll-view>
```
&emsp;&emsp;另外，在这里为了让“正在载入更多”更加动态（见gif图），可以加入动画效果，通过图片的转动实现loading的效果。这里采用类似**CSS3**中的`@keyframes`规则，在`@keyframes`中规定某项CSS样式，就能创建由当前样式逐渐改为新样式的动画效果。当在 @keyframes 中创建动画时，需要将它捆绑到某个选择器，否则不会产生动画效果。通过规定至少以下两项 CSS3 动画属性，即可将动画绑定到选择器：规定动画的名称、规定动画的时长。  
<center><img src="https://tuchuang.nos-eastchina1.126.net/GIF.gif"></center>

```css
//index.wxss
.loading{
  animation: a 1s linear infinite;
}
@keyframes a{
  from{
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to{
    -webkit-transform: rotate(1turn);
    transform:rotate(1turn);
  }
}
```  

[返回目录](#目录)

---
## **Template的使用**  
>参考文档：[微信小程序----模板](https://blog.csdn.net/m0_38082783/article/details/78909416CSDN)   

&emsp;&emsp;由于在同一个项目中需要在多处页面使用到类似的模块，这个时候创建模版就有助于减少代码量，使得代码高度复用。同一个WXML文件中创建多个类似模板用**name**属性来区分，模板的WXSS可以在全局引入也可以在使用页面引入。通过**template**标签使用模板，template标签的**is**属性与模板的name属性对应，**data**属性为传入模板的数据。
```javascript
//template模板的WXML
<template name="index_sections">
  <view class="section">
    <image src="{{item.url}}" style="display:flex" bindtap='onSectionTap'></image>
    <text class="section_name">{{item.title}}</text>
  </view>
</template>
```
在index页面使用template模板：
```javascript
<import src="../../template/index_sections.wxml"/>
<view style="width:720rpx;margin:10rpx 15rpx 7.5rpx 15rpx;display:flex">
    <template wx:for="{{sections1}}" is="index_sections" data="{{item}}"></template>
</view>
```

[返回目录](#目录)

---
## **小程序的页面跳转和传值**  
>参考文档：[小程序官方开发文档——事件](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html)  

&emsp;&emsp;在小程序中：事件是视图层到逻辑层的通讯方式。事件可以将用户的行为反馈到逻辑层进行处理。事件可以绑定在组件上，当达到触发事件，就会执行逻辑层中对应的事件处理函数。事件对象可以携带额外信息，如id、dataset、touches。  
&emsp;&emsp;具体事件的应用如下：
* 首先在组件中绑定一个事件处理函数。
```javascript
<image src="{{item.img}}" bindtap='onGoodTap' id='{{item.id}}' data-hi="11"></image>
```
* 在相应的Page定义中写上相应的事件处理函数，参数是event。
```javascript
onGoodTap:function(e){
    let id=e.currentTarget.id;
    wx.navigateTo({
      url: '../goods/goods?id='+id,
    })
}
```
&emsp;&emsp;其中`currentTarget`是一个事件对象，它包含了id（当前组件的id）、tagName（当前组件的类型）以及dataset（当前组件上由data-开头的自定义属性组合的集合，在上面的例子中即为hi=11）。  
&emsp;&emsp;在视图层和逻辑层之间的传值完成后，`wx.navigateTo`方法利用url的方式即可完成页面的跳转并可以携带部分信息到新的页面。
* 传递的参数通过新的Pages里面的`onLoad()`函数的参数`options`返回。
```javascript
onLoad: function (options) {
  console.log(options.id);  //得到前一个Pages传递的数据
}
```

[返回目录](#目录)

---
## **自定义tabBar组件（component）**  
>参考文档：  
>1.[微信小程序开发——自定义tabBar](https://blog.csdn.net/qq_30817073/article/details/81450559)  
>2.[小程序官方文档——路由](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html)

&emsp;&emsp;由于小程序的tabBar不能支持自定义样式，而且不支持多级页面（即tab标签无法跳转到非tab标签的页面，具体的Tab切换对应的生命周期可以见参考文档中给出的小程序官方文档）。而本次开发的tabBar是类似于下图的。  
<center><img src="https://tuchuang.nos-eastchina1.126.net/%E6%97%A0%E6%A0%87%E9%A2%98.png"></center>

&emsp;&emsp;查了很多资料，发现网上大多数的自定义的做法是写成模板的形式，但是在页面切换的时候由于重新渲染，tabbar会出现闪动，所以这里采取写成组件的形式，这样在页面跳转的时候不会闪动。

&emsp;&emsp;具体的实现方法:
1. 封装tabBar组件属性列表，实现仿照官方tabBar定义。
```js
//  "../component/tabbar.js"
Component({
  // 组件的属性列表
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "",
        "color": "",
        "selectedColor": "",
        "list": [{
            "pagePath": "",
            "iconPath": "",
            "selectedIconPath": "",
            "text": ""
          },
          ...
        ]
      }
    }
  },
})
```
2.在`App.js`中的`onLaunch()`方法中，用`wx.hideTabBar()`隐藏系统自带的tabbar，同时根据当前的页面栈判断是否选中tab标签，从而控制tab标签的selected状态。
```js
//app.js
editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages(); //获取当前页面栈
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath)
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
```
3.因为标签中涉及到两种不同的tab，“我要卖”的tab是要跳转到非tab页面的，所以在wxml中要设置不同的跳转方式。
```html
//tabbar.wxml
<navigator wx:if="{{item.isSpecial}}" open-type="navigate" ···>
  <!--跳转到非tab页面-->
</navigator>
<navigator wx:else open-type="switchTab">
  <!--跳转到tab页面-->
</navigator>
```
&emsp;&emsp;在上面的组件和状态切换方法写完后，在`app.json`中配置tabBar，因为点击“我要卖”是跳转到非tab页面，所以不需要配置在tabBar的list中。然后在tab标签（如首页和个人中心）的页面的`data`中加入`tabbar:{}`，并在`onLoad()`中调用`app.editTabbar()`方法，同时在tab标签的页面的json文件中加入以下代码:
```json
"usingComponents":{
  "tabbar":"../../component/tabbar/tabbar"
}
```
&emsp;&emsp;最后在wxml中调用组件。
```html
<tabbar tabbar="{{tabbar}}"></tabbar>
```

[返回目录](#目录)

---
## **表单的布局** 

>参考文档：  
>1.[菜鸟教程--Flex布局语法教程](https://www.runoob.com/w3cnote/flex-grammar.html)  
>2.[WeUI官方文档](https://github.com/Tencent/weui-wxss)  
>3.[柳正来的博客园：从WeUI学习到的知识点](https://www.cnblogs.com/7z7chn/p/5727245.html)  
>4.[微信小程序表单验证](https://blog.csdn.net/lq_lq314/article/details/72729957)  
>5.[金额的正则表达式校验](http://www.cnblogs.com/mr-wuxiansheng/p/6437133.html)  
>6.[微信小程序实现图片上传、删除和预览功能的方法](https://www.jb51.net/article/130789.htm)  


### **Flex布局**  
&emsp;&emsp;对于盒状模型的布局主要采用`Flex`布局，即“弹性布局”，菜鸟教程的教程写的非常详细。这里只强调分清Flex容器和Flex项目（容器的所有子元素自动成为容器成员，即Flex项目）的关系，对齐方式主要在容器属性中设置，因为容器划分了主轴和交叉轴；元素的比例之类的则是在项目属性中设置，并且项目的属性推荐直接使用`flex`属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。


### **picker滚动选择器**  
&emsp;&emsp;picker选择器分为5种：分别为普通选择器、多列选择器、时间选择器、日期选择器以及省市区选择器，默认为普通，运行效果如下图：
<img src="https://tuchuang.nos-eastchina1.126.net/Picker%E9%80%89%E6%8B%A9%E5%99%A8.png"/>

&emsp;&emsp;picker的使用主要是在js文件中定义待选的列表`range` ，然后利用picker的`bindchange()`事件函数得到当前选择的`range`的下标`value`，然后根据返回的下标重新渲染并显示文本，代码如下：

```html
<!--.wxml文件-->
<picker bindchange="bindSectionChange" value="{{SectionIndex}}" range="{{Sections}}">
  <text class="sell_select">{{Sections[SectionIndex]}}</text>
</picker>
```
```js
//.js文件
data: {
  Sections: ["","","","","",...], //picker滚动选择器数据列表
  SectionIndex: 0,
}
bindSectionChange: function(e) {
    this.setData({
      SectionIndex: e.detail.value
    })
},
```

### **textarea文本字数限定**  
&emsp;&emsp;如微博之类的软件，经常会使用文本输入区域的字数限定来防止数据量过大的出现，所以，这里也想对于用户发布的内容进行字数限定，并且能显示计数,超过一定字数的时候还能进行标红的提示的时候，实际效果如图：

<img src="https://tuchuang.nos-eastchina1.126.net/z%E5%AD%97%E6%95%B0%E9%99%90%E5%AE%9A.png" />

&emsp;&emsp;这里的实现主要利用textarea的`bindinput()`事件返回当前文本框中的元素长度，并且设置textarea的`maxlength`属性来控制输入的字数,代码如下：

```html
<!--.wxml文件-->
 <textarea placeholder="文字描述" placeholder-class='placeholder' maxlength='140' bindinput='bindInput'></textarea>
<!--当输入字数超过130个字，将右下角的提示数字标红-->
 <view wx:if="{{InputLength>130}}">
  <text class="sell_hint_text">{{InputLength}}</text>
</view>
<view wx:else>
  <text class="sell_text">{{InputLength}}</text>
</view>
```
**注：**`placeholder`为输入字段预期值的提示信息，该提示会在输入字段为空时显示，并会在字段获得焦点时消失，小程序也给出了`placeholder`的样式自定义，通过`placeholder-class`字段进行定义。

```js
bindInput: function(e) {
  var InputLength = e.detail.value.length;
  this.setData({
    InputLength: InputLength,
  })
}
```

### **表单数据验证**

### **伪元素实现上传图片的预览以及删除**   


[返回目录](#目录)

---
## **小程序的登录态和用户信息管理**  
>参考文档：  
>1.[小程序：用户登录状态检查与更新实例](https://blog.csdn.net/qq_33594380/article/details/80508438)  
>2.[小程序：授权、登录、session_key、unionId](https://blog.csdn.net/qq_33594380/article/details/80431582)  
>3.[小程序官方文档：开放能力——用户信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)  
>4.[微信小程序中登录和登录态维护](https://www.jianshu.com/p/c5f6c98b2685)  

&emsp;&emsp;实现小程序的登录态管理主要过程在官方文档中已经明确给出，如下图：  

<img src="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/image/api-login.jpg"/>  

1. 小程序端的任务就是检测本地是否存在登录态（即3rd_session），如存在登录态，则可以根据本地存储的3rd_session向第三方服务器端请求用户数据；如没有登录态，则发送凭证给第三方服务器换取登录态。
2. 第三方服务器端（开发者的后台服务器）的任务就是接收小程序端的code凭证，并用code向微信服务器换取openid和session_key（虽然现在还没发现session_key的实际作用），将这些信息存储并向小程序返回3rd_session，并且以后均通过3rd_session来发送和更新用户信息。  

所以，


[返回目录](#目录)

---
## **自定义轮播图dots样式**  
>参考文档：  
>1.[微信小程序自定义轮播图swiper dots默认样式](https://blog.csdn.net/rorntuck7/article/details/54378963)  
>2.[微信小程序swiper控件卡死的解决方法](https://blog.csdn.net/oagnuygnef/article/details/80506442)

[返回目录](#目录)

---
## **七牛云对象存储**
>参考文档：  
>1.[Qiniu-wxapp-SDK](https://github.com/gpake/qiniu-wxapp-sdk#prepare)  
>2.[Qiniu Cloud SDK for Node.js](https://github.com/qiniu/nodejs-sdk)  

[返回目录](#目录)

---
## **存储表的设计**
>参考文档：  
>[MongoDB 进阶模式设计](http://www.mongoing.com/mongodb-advanced-pattern-design)

[返回目录](#目录)

---
## **小程序的上拉刷新和下拉加载**

[返回目录](#目录)

---
## **小程序的性能优化**  
>参考文档：  
>1.[小程序官方文档：优化建议](http://www.huimin111.com/news/5650.html)  
>2.[微信小程序：一些运行细节及针对性的优化策略](https://blog.csdn.net/i10630226/article/details/81042421)  
>3.[小程序redux性能优化，提升三倍渲染速度](http://www.huimin111.com/news/5650.html)

&emsp;&emsp;在之前开发的过程中，并没有考虑小程序运行性能的问题，昨天偶然发现小程序会偶然性地出现加载很慢，有时候甚至是长时间刷不出来的情况。这才考虑到性能的问题，如官方文档里面提到的：
>`setData()`是小程序开发中使用最频繁的接口，也是最容易引发性能问题的接口。 
> 
>小程序的视图层目前使用 WebView 作为渲染载体，而逻辑层是由独立的 JavascriptCore 作为运行环境。在架构上，WebView 和 JavascriptCore 都是独立的模块，并不具备数据直接共享的通道。当前，视图层和逻辑层的数据传输，实际上通过两边提供的 evaluateJavascript 所实现。即用户传输的数据，需要将其转换为字符串形式传递，同时把转换后的数据内容拼接成一份 JS 脚本，再通过执行 JS 脚本的形式传递到两边独立环境。
>
>而 evaluateJavascript 的执行会受很多方面的影响，数据到达视图层并不是实时的。

&emsp;&emsp;知道可能存在的问题，回到小程序端的代码查看了一下，果然在初始化数据的时候大量的使用了`setData()`，因此针对该过程加入一个callback，查看每一次的渲染时间，代码如下：
```js
let startTime=Date.now();
this.setData({
  data:data
},()=>{
  let endTime=Date.now();
  console.log(endTime-startTime,"渲染时间");
})
```
&emsp;&emsp;结果在log里面发现，初始化阶段的很多简单赋值语句都有可能占用上百ms，更何况原始的代码里多个页面初始化都使用了`setData()`，自然程序的加载耗时就会大幅增长。  
&emsp;&emsp;所以修改逻辑就是，非视图层所需要的参数都不需要使用`setData()`，直接对`this.data.xxx`进行赋值即可，使同一个页面中的`setData()`尽可能的少。

[返回目录](#目录)

