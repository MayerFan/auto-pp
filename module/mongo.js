'use strict'

const MongoClient = require('mongodb').MongoClient
const config = require('config-lite')(__dirname)
const dbUrl = config.dbUrl
const dbName = config.dbName

module.exports = {
  insert  : insert,
  find    : find,
  findmax : findMax,
  remove  : remove,
  distinct: distinct
}

// 插入数据
function insert(table, data, callback) {

  MongoClient.connect(dbUrl, (err, db) => {
    var newErr = null
    var result = null

    if (err) {
      newErr = err
      callback(newErr, result)
      return
    }
    
    var database = db.db(dbName)

    if (isArray(data)) {
      database.collection(table).insertMany(data, (err, res) => {
        if (err) {
          newErr = err
        } else {
          result = res
        }
        callback(newErr, result)
        db.close()
      })
    } else {
      database.collection(table).insertOne(data, (err, res) => {
        if (err) {
          newErr = err
        } else {
          result = res
        }
        callback(newErr, result)
        db.close()
      })
    }

  })

} 

// 删除数据
function remove(table, condition, callback) {
  
  MongoClient.connect(dbUrl, (err, db) => {
    var newErr = null
    var result = null

    if (err) {
      newErr = err
      callback(newErr, result)
      return
    }

    var database = db.db(dbName)
    database.collection(table).remove(condition, (err, res) => {
      if (err) {
        newErr = err
      } else {
        result = res
      }
      callback(newErr, result)
      db.close()
    })
  })
}

// 更新数据

// 查询数据
// option: {'sort': {'key': 1/-1}, 'limit': num}. 顺序和每次取出限制
function find(table, condition, option, callback) {

  var sortKey = option.sort
  var limitKey = option.limit

  MongoClient.connect(dbUrl, (err, db) => {
    var newErr = null
    var result = null

    if (err) {
      newErr = err
      callback(newErr, result)
      return
    }

    var database = db.db(dbName)
    var cursor = database.collection(table).find(condition)

    if (sortKey && limitKey) {
      cursor = cursor.sort(sortKey).limit(limitKey)
    } else if (sortKey && !limitKey) {
      cursor = cursor.sort(sortKey)
    } else if (!sortKey && limitKey) {
      cursor = cursor.limit(limitKey)
    } 

    cursor.toArray((err, res) => {
      if (err) {
        newErr = err
      } else {
        result = res
      }
      callback(newErr, result)
      db.close()
    })

  })

}

// 查询符合条件的数据集合中的某个字段最大的值
// field : 此字段的最大值
function findMax(table, condition, field, callback) {

  MongoClient.connect(dbUrl, (err, db) => {
    var newErr = null
    var result = null

    if (err) {
      console.log('连接数据库失败')
      newErr = err
      callback(newErr, result)
      return
    }

    var database = db.db(dbName)
    database.collection(table).find(condition).sort({'build' : -1}).limit(1).toArray((err, res) => {
      if (err) {
        newErr = err
      } else {
        result = res
      }
      callback(newErr, result)
      db.close()
    })

  })
}

// 去重查询
function distinct(table, field, callback) {

  MongoClient.connect(dbUrl, (err, db) => {
    var newErr = null
    var result = null

    if (err) {
      newErr = err
      callback(newErr, result)
      return
    }

    var database = db.db(dbName)
    database.collection(table).distinct(field).then(data => {
      callback(newErr, data)
      db.close()
    })
  })
}


function isArray(arr) {
  return arr.constructor.toString().indexOf('Array') > -1
}