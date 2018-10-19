var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-parser')
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//定义chema
var goodSchema = new Schema({
    UserId: {
        type: String,
        required: true,
    },
    UserNickname: String,
    UserAvatar: String,
    UserLocation: String,
    SectionId:String,
    Description:String,
    GoodImage:String,
    GoodImgList:Array,
    created_at: { type: Date, default: Date.now },
    updated_at: Date
});
//定义model
var goodModel = mongoose.model('goodModel', goodSchema);    //goodModel即collection名,在mongdb中会生成

var app = express();

app.all('*', function (req, res, next) {
    //允许的来源
    res.header("Access-Control-Allow-Origin", "*");
    //允许的头部信息，如果自定义请求头，需要添加以下信息，允许列表可以根据需求添加
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
    //允许的请求类型
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

//var env = process.env.NODE_ENV || 'development';
var env='development';


if ('development' == env) {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
    mongoose.connect('mongodb://localhost:27017/goods', { useNewUrlParser: true });
    app.listen(3000);
    console.log("server is listening in 3000");
}

if ('test' == env) {
    mongoose.connect('mongodb://localhost:27017/todo_development', { useNewUrlParser: true });
    app.listen(3001);
};

app.get('/goods', function (req, res, next) {
    goodModel.find({}, function (err, docs) {
        res.json(docs);
    });
});

app.get('/sections',function(req,res){
    var SectionId=req.query.id;
    console.log(SectionId);
    goodModel.find({'SectionId':SectionId},function(err,docs){
        res.json(docs);
    });

});

