var express = require('express'),

var router = express.Router();

router.get('/login', function (req,res,next) {
    let code=req.query.code;

    request.get({
        uri:'https://api.weixin.qq.com/sns/jscode2session',
        json:true,
        qs:{
            grant_type:'authorization_code',
            appid:'wx53d5d5ee7b53d410',
            secret:'8eeff13af65e58be43243940764f933d',
            js_code:code
        }
    },(err,response,data)=>{
        if (response.statusCode===200){
            console.log("[openid]",data.openid);
            console.log("[session_key]",data.session_key);
        }
    })
    goodModel.find({}, function (err, docs) {
        res.json(docs);
    });
});


module.exports = router;