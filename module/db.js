var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var Config = require('./config');

class Db {
    static getInstance() {
        if (!Db.instance) {  /* 单例  解决：多次实例化 实例无共享*/
            Db.instance = new Db();
        }
        return Db.instance;
    }

    constructor() {
        this.dbClient = ''; /* 存放db 对象 */
        this.connect()
    }

    // 连接数据库
    connect() {
        return new Promise((resolve, reject) => {
            // 解决数据库多次连接问题
            if (!this.dbClient) {
                MongoClient.connect(Config.dbUrl, (err, client) => {
                    if (err) {
                        reject(err)
                    } else {
                        this.dbClient = client.db(Config.dbName);
                        resolve(this.dbClient)
                    }
                })
            } else {
                resolve(this.dbClient)
            }

        })
    }

    find(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                var result = db.collection(collectionName).find(json)
                result.toArray((err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    update(collectionName, json1, json2) {
        return new Promise((resolve,reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).updateOne(json1,{$set: json2}, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).insertOne(json, (err, result) => {
                    if (err) {
                        reject(err)
                        return;
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }

    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).removeOne(json, (err, result) => {
                    if (err) {
                        reject(err)
                        return;
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }

    getObjectId(id) {  /* mongodb 里面查询 _id 把字符串转对象  */
        return new ObjectID(id);
    }
}

module.exports = Db.getInstance()
