var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/goods', { useNewUrlParser: true });
var Model = {};
//商品Schema和Model
var goodSchema = new mongoose.Schema({
    uId: { type: String, required: true, },
    uName: String,
    uAva: String,
    uPlace: Number,
    uCollege:Number,
    sId: Number,
    title: String,
    describe: String,
    price: Number,
    oriPrice: Number,
    imgList: Array,
    createAt: { type: Date, default: Date.now },
    favor: Number
}, { versionKey: false });
Model.goodModel = mongoose.model('goodModel', goodSchema);    //goodModel即collection名,在mongdb中会生成

//用户Schema和Model
var userSchema = new mongoose.Schema({
    uId: { type: String, require: true},
    stuId: String,
    uName: String,
    uAva: String,
    uPlace: Number,
    uCollege: Number,
}, { versionKey: false });
Model.userModel = mongoose.model('userModel', userSchema);

//商品评论表
var commentSchema=new mongoose.Schema({
    gId:{type:mongoose.Schema.ObjectId,ref:'goodModel'},
    uId:String,
    uAva:String,
    uName:String,
    cuId:String,
    cuName:String,
    cmt:String,
    createAt:{type:Date,default:Date.now}
},{versionKey:false});
Model.commentModel=mongoose.model('commentModel',commentSchema);

//收藏表

module.exports = Model;