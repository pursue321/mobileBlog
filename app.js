// 引入模块
var express = require('express');
var app = express();
var path = require('path');
var ejs = require('ejs');

var async = require('async');
var request = require('request');

var config = require('./webpack.config');

//连接mongodb数据库
var mongoose = require('mongoose');
require('express-mongoose');

mongoose.connect('mongodb://lx.mobileblog.xmixue.com/blogdb');
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});
var userModel = require('./server/models/userModel');
var indexArcModel = require('./server/models/indexArcModel');
//models
var User = userModel.userModel;
var IndexArc = indexArcModel.indexArcModel;


// 对所有(/)URL或路由返回main.html 
app.get('/', function (req, res) {
    res.render('main');
});

// 设置views路径和模板
app.set('views', './client/view');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// 静态文件配置
app.use('/client/src', express.static(path.join(__dirname, 'client/src')));

app.get('/users', function(req, res) { 
    res.send(User.find());
});
app.get('/indexarc', function(req, res) { 
    res.send(IndexArc.find());
});
app.get('/detail', function(req, res) { 
	var id = req.query.article_id;
	console.log('======id',id);
    res.send(IndexArc.findOne({_id:id}));
});
app.post('/addread', function(req, res) { 
    var id = req.query.article_id;
    var count = req.query.read_count;
    console.log('======idandcount', id);
    res.send(IndexArc.update({_id:id}, {read_count: count}));
});

// 启动一个服务，监听从端口进入的所有连接请求

var server = app.listen(config.port, config.host, function(err){  
    if (err) {
        console.log(err);
    }
    console.log('Listening at http://' + config.host + ':' + config.port);
}); 