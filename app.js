var express = require('express');
var app = express();
var fs = require("fs");
var xlsx = require('node-xlsx');
var Info = require('./info');

var bodyParser = require('body-parser');
var multer = require('multer');

var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/infos', () => { console.log('connected'); });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/' }).array('image'));
app.use(express.static('js'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/" + "file.html");
})

app.post('/file_upload', function(req, res) {
    //console.log(req.files[0]); // 上传的文件信息

    var des_file = __dirname + "/" + req.files[0].originalname;

    fs.readFile(req.files[0].path, function(err, data) {
        fs.writeFile(des_file, data, function(err) {
            if (err) {
                console.log(err);
            } else {
                response = {
                    message: 'File uploaded successfully',
                    filename: req.files[0].originalname
                };
            };
            var cellData = xlsx.parse(data)[0].data;
            var newData = [];
            var databaseInfo = [];
            for (var i = 0; i < cellData.length; i++) {
                if (cellData[i].length !== 0) {
                    for (var j = 0; j < cellData[i].length; j++) {
                        if (cellData[i][j] == null) {
                            cellData[i][j] = '';
                        }
                    }
                    newData.push(cellData[i]);
                }
            }
            for (var j = 1; j < newData.length; j++) {
                var ele = newData[j];
                var info = new Info({
                    '姓名': ele[0],
                    '性别': ele[1],
                    '年龄': ele[2],
                    '工作': ele[3],
                    '工资': ele[4],
                    '工作年限': ele[5]
                });

                info.save((err, file) => {
                    if (err) console.log(err);
                    // else console.log('saved');
                })
                databaseInfo.push(info);
            }
            res.json(databaseInfo);
        });
    });

});

app.get('/info', function(req, res) {
    var user = {
        '姓名': '孙磊磊',
        '性别': '男',
        '年龄': 24,
        '工作': '前端',
        '工资': 6000,
        '工作年限': 2
    };
    //给数据库插入数据
    db.collection('infos').insert(user);
    //根据条件查找数据
    Info.find({ '工作': '前端' })
        .where('年龄').gt(24).lt(30)
        .sort('工资')
        .exec(function(err, docs) {
            if (err) console.log(err);
            res.json(docs);
            console.log(docs);
        });
});

//receive input value
app.post('/send', function(req,res){
    console.log(req.body);
    res.end();
});

var server = app.listen(3000, function() {
    console.log('server running on 3000 port');
});
