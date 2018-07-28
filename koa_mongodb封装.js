var MongoClient = require('mongodb').MongoClient;

var dbUrl = 'mongodb://127.0.0.1:27017/';
var dbName = 'koa';

// 链接数据库
console.time('start')
MongoClient.connect(dbUrl, (err, client) => {
    if (err) {
        console.log(err);
        return;
    }

    var db = client.db(dbName);

    // 新增数据库
    // db.collection('user').insertOne({ 'username': "刘五", 'age': 30, "status": 0 }, (err, result) => {
    //     if(!err) {
    //         console.log('数据增加成功')

    //         client.close();
    //         console.timeEnd('start')
    //     }
    // })

    // 查询数据库
    var result = db.collection('user').find({});
    console.log(result);

    result.toArray((err, docs)=>{
        console.log(docs)
    })
})