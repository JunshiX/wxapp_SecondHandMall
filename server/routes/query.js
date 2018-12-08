var express = require('express'),
    getDateDiff = require('../utils/utils'),
    Model = require('../models/model');//调用自定义的Mongoose Model

var router = express.Router();
var goodModel = Model.goodModel;

var pageNum = 100;

router.get('/goods', function (req, res) {
    var scrollPage = req.query.page;
    goodModel.find({}, function (err, docs) {
        for (var item in docs) {
            let time=getDateDiff(docs[item]["createAt"]);
            docs[item]["createAt"]=time;
        }
        res.json(docs);
    }).limit(pageNum).skip(scrollPage * pageNum).sort({ '_id': -1 }).lean();
});

router.get('/sections', function (req, res) {
    var sId = req.query.id;
    var scrollPage = req.query.page;
    goodModel.find({ 'sId': sId }, function (err, docs) {
        for (var item in docs) {
            let time=getDateDiff(docs[item]["createAt"]);
            docs[item]["createAt"]=time;
        }
        res.json(docs);
    }).limit(pageNum).skip(scrollPage * pageNum).sort({ '_id': -1 }).lean();
});

router.get('/good', function (req, res) {
    var _id = req.query._id;
    goodModel.find({ '_id': _id }, function (err, docs) {
        res.json(docs);
    });
});

module.exports = router;