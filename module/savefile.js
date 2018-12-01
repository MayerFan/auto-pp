'use strict'

const fs = require('fs')
const path = require('path')
const plist = require('plist')
const mongo = require('./mongo')

// 只接收 ipa 和 apk 文件
function saveFile(req, callback) {

  const cachePath = req.files.file.path
  const fileName = req.files.file.name

  var platformDir = '' //平台路径
  var fileFullPath = ''//文件全路径
  var tableName = '' //数据库表名。 iOS：ipa ；android：apk

  //判断扩展名。区分iOS，android
  const extName = path.extname(fileName)
  if (extName === '.ipa') {
    platformDir = './FileDir/iOS'
    tableName = 'ipa'
  } else if (extName === '.apk') {
    platformDir = './FileDir/Android'
    tableName = 'apk'
  } else {
    callback('只接收ipa和apk文件')
    return
  }

  fileFullPath = path.join(platformDir, fileName)

  // 配置字段信息
  const fieldArray = fileName.split('_')
  var name = fieldArray[0]
  var version = fieldArray[1]
  var build = 1
  var info = req.body.info

  // 查询条件
  var condition = {
    "name"    : name,
    "version" : version
  }
  mongo.findmax(tableName, condition, 'build', (err, res) => {
    if (res.length > 0) {
      build = res[0].build
      build++
    }
    
    // 插入数据
    var data = {
      "name"    : name,
      'version' : version,
      'build'   : build,
      'info'    : info,
      'path'    : fileName,
      'time'    : new Date().getTime()
    }
    mongo.insert(tableName, data, (err, res) => {
      if (!err) { //插入成功，移动文件到指定目录
        fs.rename(cachePath, fileFullPath, (err) => {
          if (err) { //移动文件失败，删除表中刚刚插入的数据
            console.log(err)
            callback(err)
          } else {
            callback(null)
          }
        })
      }
    })

  })


}






// function saveFile(req, result) {
  
//   const cachePath = req.files.file.path
//   const fileName = req.files.file.name

//   var platformDir = '' //平台路径
//   var projectName = '' //项目名字
//   var fileFullPath = ''//文件全路径

//   //判断扩展名。区分iOS，android
//   const extName = path.extname(fileName)
//   if (extName === '.ipa') {
//     platformDir = './FileDir/iOS'
//   } else if (extName === '.apk') {
//     platformDir = './FileDir/Android'
//   }
  
//   projectName = fileName.split('_')[0]
//   var projectPath = path.join(platformDir, projectName)
//   fileFullPath = path.join(projectPath, fileName)

//   // 判断项目目录是否存在，不存在创建
//   fs.stat(projectPath, (err, status) => {

//     if (!err) { //已经存在，直接保存文件
//       doSave(fileFullPath, cachePath, extName, result)

//     } else if (err.errno == -2) { 

//       fs.mkdir(projectPath, (err1) => { //先创建目录，再保存文件
//         if (!err1) {
//           doSave(fileFullPath, cachePath, extName, result)
//         }
//       })

//     }
//   })
  
// }


// // cachePath: multiparty 模块的临时文件目录
// function doSave(filePath, cachePath, extName, result) {
//   var index = 1
//   // 文件重命名
//   var newFilePath = filePath.replace(`${extName}` ,`_${index}${extName}`)

//   while (isExistFile(newFilePath, cachePath, result)) {
//     index++
//     newFilePath = filePath.replace(`${extName}` ,`_${index}${extName}`)
//   }
// }

// function isExistFile(path, cachePath, result) {
//   if (fs.existsSync(path)) {
//     return true
//   } else {
//     fs.rename(cachePath, path, (err) => {
//       if (err) {
//         console.log(err)
//         result(err)
//       } else {
//         result(null)
//       }
//     })
//     return false
//   }
// }

module.exports = saveFile