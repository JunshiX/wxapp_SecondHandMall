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
    comment: Array
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
    uComment: Array,
    uFavor: Array
}, { versionKey: false });
Model.userModel = mongoose.model('userModel', userSchema);

//商品评论表
var commentSchema=new mongoose.Schema({
    
})

module.exports = Model;