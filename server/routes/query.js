var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    Model = require('../models/model');//调用自定义的Mongoose Model

var router = express.Router();
var goodModel = Model.goodModel;

express().use(bodyParser.json());
express().use(bodyParser.urlencoded({ extended: true }));
express().use(methodOverride());

router.get('/goods', function (req,res) {
    goodModel.find({}, function (err, docs) {
        res.json(docs);
    });
});

router.get('/sections', function (req, res) {
    var SectionId = req.query.id;
    goodModel.find({ 'SectionId': SectionId }, function (err, docs) {
        res.json(docs);
    });
});

router.get('/good', function (req, res) {
    var _id = req.query._id;
    goodModel.find({ '_id': _id }, function (err, docs) {
        res.json(docs);
    });
});

module.exports = router;