var express = require('express'),
    redis = require('redis'),
    Model = require('../models/model');//调用自定义的Mongoose Model

var router = express.Router(),
    goodModel = Model.goodModel,
    userModel = Model.userModel,
    commentModel=Model.commentModel,
    client = redis.createClient(6379, 'localhost');

router.post('/upload', function (req, res, next) {
    let sessionId = req.body.sessionId;
    client.get(sessionId, function (err, rep) {
        if (!rep) res.status(404).json({ error: 0 });
        else {
            let redisValue = JSON.parse(rep);
            let uId = redisValue.openid;
            userModel.find({ 'uId': uId }, function (err, docs) {
                if (!docs) res.status(404).json({ error: 1 });
                else {
                    let goodInfo = {
                        uId: uId,
                        uName: docs[0]['uName'],
                        uAva: docs[0]['uAva'],
                        uPlace: docs[0]['uPlace'],
                        uCollege: docs[0]['uCollege'],
                        sId: req.body.sId,
                        title: req.body.title,
                        describe: req.body.describe,
                        price: req.body.price,
                        oriPrice: req.body.oriPrice,
                        imgList: req.body.imgList,
                    };
                    let goodInsert = new goodModel(goodInfo);
                    goodInsert.save(function (error) {
                        if (error) res.status(500).json({error:1});
                        else{
                            console.log("商品信息已载入");
                            res.json("商品信息已载入");
                        }
                    })

                }
            })
        }
    })
});

router.post('/submitCmt',function(req,res,next){
    let sessionId = req.body.sessionId;
    client.get(sessionId, function (err, rep) {
        if (!rep) res.status(404).json({ error: 0 });
        else {
            let redisValue = JSON.parse(rep);
            let uId = redisValue.openid;
            console.log(uId);
            userModel.find({ 'uId': uId }, function (err, docs) {
                if (!docs) res.status(404).json({ error: 1 });
                else {
                    let cmtInfo = {
                        gId:req.body.gId,
                        uId: uId,
                        uName: docs[0]['uName'],
                        uAva: docs[0]['uAva'],
                        cuId:req.body.cuId,
                        cuName:req.body.cuName,
                        cmt:req.body.cmt
                    };
                    let cmtInsert = new commentModel(cmtInfo);
                    cmtInsert.save(function (error) {
                        if (error) res.status(500).json({error:1});
                        else{
                            console.log("评论信息已载入");
                            res.json("评论信息已载入");
                        }
                    })

                }
            })
        }
    })


})

module.exports = router;