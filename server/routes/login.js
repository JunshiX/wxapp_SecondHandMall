var express = require('express'),
    request = require('request'),
    Model = require('../models/model');//调用自定义的Mongoose Model

//redis
var redis = require('redis'),
    client = redis.createClient(6379, 'localhost');
//生成uuid
const uuidv1=require('uuid/v1');

var router = express.Router();
var userModel = Model.userModel;

router.get('/login', function (req, res, next) {
    let code = req.query.code;

    request.get({
        uri: 'https://api.weixin.qq.com/sns/jscode2session',
        json: true,
        qs: {
            grant_type: 'authorization_code',
            appid: 'wx53d5d5ee7b53d410',
            secret: '8eeff13af65e58be43243940764f933d',
            js_code: code
        }
    }, (err, response, data) => {
        if (response.statusCode === 200) {
            let redisKey=uuidv1();
            client.set(redisKey,JSON.stringify({openid:data.openid,sessionKey:data.session_key}),'EX',30*24*60*60);
            res.json(redisKey);
        }
    })
});

router.get('/authorize', function (req, res, next) {
    let openid = req.query.openid,
        uname = req.query.uname,
        uavatar = req.query.avatar,
        lnum = req.query.lnum,
        cnum = req.query.cnum;
    let userInfo = {
        uId: openid,
        uName: uname,
        uAvatar: uavatar,
        uLocation: lnum,
        uCollege: cnum,
    }
    let userInsert = new userModel(userInfo);
    userInsert.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('成功插入数据');
        }
    })
})
module.exports = router;