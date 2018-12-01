'use strict'

const mongo = require('./mongo')
const plist = require('plist')
const fs = require('fs')
const tool = require('./tool')

// 查找内容
function readInfo(plat, project, callback) {

  var table = null  
  if (plat === 'ios') {
    table = 'ipa'
  } else if (plat === 'andriod') {
    table = 'apk'
  } else {
    callback('路由错误')
  }

  var pro = project;
  findProject(table, (err, res) => {

    if (err) {
      callback(err)
    } else {

      if (!pro && res.length > 0) {
        pro = res[0]
      } else if (res.length == 0) {
        callback(err, {'project': [], 'list': []})
        return
      }
      
      pro = pro.toUpperCase()
      // 重新包装结果数组。供视图页面使用
      var newResult = new Array()
      res.forEach((item, index) => {
        var obj = new Object()
        obj.name = item; //工程名字
        if (item === pro) {
          obj.selected = true //是否是指定搜索的工程
        } else{
          obj.selected = false
        }
        newResult[index] = obj
      })

      findList(table, pro, (err, res) => {
        if (err) {
          callback(err, null)
        } else {
          callback(err, {'project': newResult, 'list': wrapList(res)})
        }
      })
    }
  })
}

// 查找项目列表
function findProject(table, callback) {
  mongo.distinct(table, 'name', (err, res) => {
    callback(err, res)
  })
}

// 查找某一项目build包列表
function findList(table, project, callback) {

  var condition = {
    'name' : project
  }

  mongo.find(table, condition, {'sort': {'version': -1, 'build': -1}, 'limit': 10}, (err, res) => {
    if (!err && res.length > 0) {
      createPlist(res)
    }
    callback(err, res)
  })
}

// 生成plist文件
function createPlist(lists) {

  const jsonPlate = {
    "items": [{
      "assets": [{
        "kind": "software-package",
        "url": "https://app.58btc.com/58COIN_V2.6.7_20181019180777.ipa"
      }],
      "metadata": {
        "bundle-identifier": "com.58btc.tb",
        "bundle-version": "2.6.8",
        "kind": "software",
        "title": "58COIN"
      }
    }]
  }

  const domain = 'http://192.168.3.77'

  const fileDir = './FileDir/plist/'
  // 先清空文件夹
  var files = fs.readdirSync(fileDir)
  files.forEach((file) => {
    fs.unlinkSync(fileDir + '/' + file)
  })
  
  lists.forEach(list => {
    // 更新json模板信息
    var url = domain + '/files/' + list.path
    jsonPlate.items[0].assets[0].url = url
    jsonPlate.items[0].metadata["bundle-version"] = list.build
    jsonPlate.items[0].metadata.title = list.name

    // 生成plist
    var rowPlist = plist.build(jsonPlate)

    // 保存plist到本地plist文件夹中
    var plistPath = fileDir + list.name + '_' + list.version + '_' + list.build + '.plist'
    fs.writeFile(plistPath, rowPlist, (err) => {
      if (err) {
        console.log(err)
      }
    })
  });

}

// 时间戳格式化
function wrapList(results) {
  results.forEach(result => {
    if (result.time) {
      result.time = tool.dateFormater(result.time)
    }
  })
  return results
}

module.exports = readInfo