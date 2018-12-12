var qiniu = require("qiniu"),
    express = require('express');

var router = express.Router();

//用户的Access Key和Secret Key
var accessKey = "RuYn-ZnaiS_Sfj5WZ2VqVvSIFzUNvPGvGVj_k3hm";
var secretKey = "1T5pVMOa4xpLxO-Ebq50x-ezjhc_O1Q5veflWdJJ";
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

//要上传的空间
var bucket = "chenxing1020";

//构建上传策略函数
function uptoken(bucket) {
    var options = { scope: bucket };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(mac);
}

router.get('/uptoken', function (req,res,next) {
    var token = uptoken(bucket);
    res.json({ uptoken: token });
});

module.exports = router;