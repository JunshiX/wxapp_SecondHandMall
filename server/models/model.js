var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/goods', { useNewUrlParser: true });
//定义Schema
var goodSchema = new mongoose.Schema({
    UserId: {
        type: String,
        required: true,
    },
    UserNickname: String,
    UserAvatar: String,
    UserLocation: String,
    SectionId: String,
    Description: String,
    GoodImage: String,
    GoodImgList: Array,
    create_at: { type: Date, default: Date.now },
    update_at: Date
});
//定义model
var Model={};
Model.goodModel = mongoose.model('goodModel', goodSchema);    //goodModel即collection名,在mongdb中会生成
module.exports=Model;