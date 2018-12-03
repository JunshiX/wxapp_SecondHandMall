var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/goods', { useNewUrlParser: true });
var Model = {};
//商品Schema和Model
var goodSchema = new mongoose.Schema({
    UserId: { type: String, required: true, },
    UserNickname: String,
    UserAvatar: String,
    UserLocation: String,
    SectionId: String,
    Description: String,
    GoodImage: String,
    GoodImgList: Array,
    create_at: { type: Date, default: Date.now },
    update_at: Date
}, { versionKey: false });
Model.goodModel = mongoose.model('goodModel', goodSchema);    //goodModel即collection名,在mongdb中会生成

//用户Schema和Model
var userSchema = new mongoose.Schema({
    uId: { type: String, require: true, unique: true,dropDups: true},
    uName: String,
    uAvatar: String,
    uLocation: Number,
    uCollege: Number,
    uComment: Array,
    uFavor: Array
}, { versionKey: false });
Model.userModel = mongoose.model('userModel', userSchema);

module.exports = Model;