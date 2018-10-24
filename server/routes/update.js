var express=require('express'),
    Model=require('../models/model');//调用自定义的Mongoose Model

var router=express.Router();
var goodModel=Model.goodModel;



module.exports=router;