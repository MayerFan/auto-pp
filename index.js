'use strict'

const path     = require('path')
const config   = require('config-lite')(__dirname)
const express  = require('express')
const app      = express()
const fs       = require('fs')

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const saveFile    = require('./module/savefile')
const collectInfo = require('./module/readfile')
const staticFile  = require('./module/staticfile')
const tool        = require('./module/tool')

// 配置https
const http        = require('http')
const https       = require('https')
// 证书文件
const priKey = fs.readFileSync(path.join(__dirname, 'cer/private.pem'), 'utf8')
const cert = fs.readFileSync(path.join(__dirname, 'cer/file.crt'), 'utf8')
const credentials = {
  key  : priKey,
  cert : cert
}
const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)

const httpPort = config.httpPort
const httpsPort = config.httpsPort

httpServer.listen(httpPort, () => {
  console.log(`http server listening on port ${httpPort}`)
})
httpsServer.listen(httpsPort, () => {
  console.log(`https server listening on port ${httpsPort}`)
})

// 设置存放模板文件的目录
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎
app.set('view engine', 'ejs')

// 首页面
app.get(['/', '/app'], (req, res) => {
  res.render('home', {'plats': config.plat})
})

// // 手机端页面(快捷展示)
// app.get('/phone/:platform/(:project)?', (req, res) => {
//   collectInfo(req.params.platform, req.params.project, (err, result) => {
//     res.render('phone', {'items': result})
//   })
// })

 /**
  * 路由设计
  * /app 路径去掉 。 二维码动态处理
  * 移动设备访问 简洁访问 ； /app/58coin
  * pc端访问必须指定 平台 ： /app/ios/
  */

/// 主路由
app.get(['/app/:platform', '/app/:platform/:project'], (req, res) => {

  var plat = req.params.platform
  var project =  req.params.project

  plat = plat.toLowerCase()

  if (!tool.checkMobile(req)) { //如果PC端不是全路径，则默认为/app/ios/项目
    // 判断是否支持此平台
    var plats = new Array()
    config.plat.forEach((element, index) => {
      plats[index] = element.toLowerCase()
    });
    if (plats.indexOf(plat) == -1) {
      res.redirect(`/`)
      return
    }
  
  } else { // 移动端简洁访问路由。进行匹配
    
    if (!project) {
      project = plat
    }

    if (tool.checkIos(req)) {
      plat = 'ios'
    } else if (tool.checkAndriod(req)) {
      plat = 'andriod'
    }
  }
    
  // 平台名字小写化
  var plats = config.plat
  var platsLower = new Array()
  var remainPlats = new Array()
  plats.forEach((element, index) => {
    platsLower[index] = element.toLowerCase()
    remainPlats[index] = element
  });
  // 当前请求的平台 和余下的平台数组
  var selectedPlat = ''
  var index = platsLower.indexOf(plat)
  selectedPlat = plats[index]
  remainPlats.splice(index, 1)

  collectInfo(plat, project, (err, result) => {
    if (!err) {
      var view = 'main'
      if (tool.checkMobile(req)) {
        view = 'phone'
      }
      res.render(view, {
        'items': result.list, 
        'pros': result.project, 
        'plats': {'selected': selectedPlat, 'remain': remainPlats},
        'ip': config.serverIp,
        'httpPort': httpPort,
        'httpsPort': httpsPort
      })

    } else {
      res.end(err)
    }
    
  })
})

// 静态资源管理服务
app.get('/public/:dir/:resource', (req, res) => {
  staticFile(req, res)
})

// 文件上传(只接收ipa和apk文件)
app.post('/upload', multipartMiddleware, (req, res) => {
  saveFile(req, (err) => {
    if (!err) {
      res.end(`${req.files.file.name} upload success\n`)
    } else {
      res.end(err)
    }
  })
})

// 文件下载
app.get('/files/:path', (req, res) => {

  const fileName = req.params.path;
  var platformDir = '' //平台路径
  var fileFullPath = ''
  var memitype = ''

  //判断扩展名。区分iOS，android
  const extName = path.extname(fileName)
  if (extName === '.ipa') {
    platformDir = './FileDir/iOS'
    memitype = 'application/vnd.iphone'
  } else if (extName === '.apk') {
    platformDir = './FileDir/Android'
  } else if (extName === '.plist') {
    platformDir = './FileDir/plist'
    memitype = 'application/x-plist'
  }
  fileFullPath = path.join(platformDir, fileName)

  fs.stat(fileFullPath, (err, stats) => {
    if (!err && stats.isFile()) {
      res.writeHead(200, {
        'Content-Type': memitype
      });
      fs.createReadStream(fileFullPath).pipe(res)
    } else {
      res.end('not found')
    }
  })

})

// 证书下载
app.get('/cer', (req, res) => {
    
  var cerPath = path.join(__dirname, 'cer/file.crt')

  fs.stat(cerPath, (err, stats) => {
    if (!err && stats.isFile()) {
      res.writeHead(200, {
        'Content-Type': 'application/x-x509-ca-cert'
      });
      fs.createReadStream(cerPath).pipe(res)
    }
  })
})

// app.listen(config.port, () => {
//   console.log(`listening on port ${config.port}`)
// })