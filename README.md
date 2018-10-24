# 微信小程序设计日志  
## <font color=red>**设计说明**</font>
>参考文档：  
>1.Node.js入门经典2013版  
>2.阮一峰的网络日志：理解RESTful架构 http://www.ruanyifeng.com/blog/2011/09/restful.html    

&emsp;&emsp;本次小程序的开发采用前后端分离的思想。  
&emsp;&emsp;前端直接使用小程序官方的**WXML+WXSS+JS**框架；  
&emsp;&emsp;后端利用**NodeJS**的**Express**框架，创建基于**JSON**(JavaScript Object Notation)的**RESTful**(Representational State Transfer) API，使软件能和服务交互。API应具备如下功能。
* 能够创建、更新、删除和读取数据。
* 数据储存在**MongoDB**中。

---
## <font color=red>**Express4.x新特性**</font>
>参考文档：Moving to Express 4 http://www.expressjs.com.cn/guide/migrating-4.html  

* **更新所有依赖**  
手动修改dependencies中包的版本号太过麻烦，所以需要借助**npm-check-updates**工具将package.json中的依赖包更新到最新版本。  
```
npm install -g npm-check-updates        //安装
nuc -u      //更新dependencies到新版本
```


* **移除内置中间件**  
4.x版本将之前内置的所有中间件除了`static`都分离为单独的模块。4.x中各个模块需要单独安装，并在js文件中导入依赖。  

```javascript
//3.x代码
app.configure(funtcion(){
    app.use(express.static(__dirname+'/public'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
})
```
  
```javascript
//4.x代码
var express=require('express');
var morgan=require('morgan');//logger模块的新名字
var bodyParser=require('body-parser');
var methodOverride=require('method-override');
var app=express();

app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());
```
* **移除app.configure方法**  
使用`process.env.NODE_ENV`或者`app.get('env')`来检测环境并相应的配置应用程序。  

```javascript
//3.x代码
app.configure('development', function() {
   // configure stuff here
});
```

```javascript
//4.x代码
var env = process.env.NODE_ENV || 'development';            //控制台中需要设置环境变量set NODE_ENV=test
if ('test' == env) {
   // configure stuff here
}
```
---
## <font color=red>**Mongoose的model和Schema** </font>

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
---
## <font color=red>**Express的路由分离**</font>
>参考文档：  
>express框架的路由模块化 https://www.cnblogs.com/lewis-messi/p/9087258.html  

&emsp;&emsp;路由是由一个**URL**和一个特定的**HTTP**方法（GET、POST等）组成的，它涉及到应用如何响应客户端对某个资源的访问。  
&emsp;&emsp;在使用Express写代码的过程中，会根据类别，将路由分为多个不同的文件，然后在项目的入口文件（例如app.js）中将其依次挂载，例如：
```javascript
var index=require('./routes/index),
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
│  │
│  ├─models
│  │      model.js
│  │
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

router.get('/goods', function (req,res) {
  //function
});

router.get('/sections', function (req, res) {
  //function
});

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

---
## <font color=red>**微信小程序访问API接口**</font>
&emsp;&emsp;首先新建服务器工程,安装完依赖之后在app.js中写入读取数据库的api.
```javascript
mongoose.connect('mongodb://localhost:27017/todo_development',{useNewUrlParser:true});
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

---
## <font color=red>**Template的使用**</font>  
>参考文档：Blog：微信小程序----模板 https://blog.csdn.net/m0_38082783/article/details/78909416CSDN   

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

---
## <font color=red>**flex属性的使用**</font>  


---
## <font color=red>**小程序的页面跳转和传值**</font>  
>参考文档：小程序官方开发文档——事件 https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html  

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
