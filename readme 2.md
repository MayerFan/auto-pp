
## 自动打包
1. 安装包命名规则： 项目名_V版本号_日期

## 移动平台服务开发
#### 路由
> domain/
1. 主页面
  包含 iOS android
> domain/[ios, android]
2. 平台页面
> domain/[ios, android]/[project1, project2, ...]
3. 项目页面
> domain/upload
4. 上传文件
  * 根据`后缀名`判断平台
  * 根据文件命名规则获取`项目名`、`版本号`
  * 文件独立存储，同时把相关信息加入到数据库中
  * 数据库中每次根据同一个`项目名`、`版本号`,添加递增的`build号`
5. 数据库字段
  | --- | --- | --- | --- | --- |
  | Name | Version | Build | Info | Path |

#### 配置https
  1. 自签名https， 配置固定域名的证书。便于以后修改host文件，可以随意绑定ip。 `app.58btc.com`
  2. 

#### 动态plist



## 自动上传




### Q 
  1. 请求文件下载过程?
    * 配置文件流，直接返回
  2. 局域网分配固定ip
  3. 引入外部js问题
  4. 静态资源管理服务
  5. 如果手机设备无法连接自签名服务器。需要设备首先安装签名证书。
    * 无论是http还是https都可以下载证书
    * iOS安装的crt证书，必须配置`content-type: application/x-x509-ca-cert`

  6. 报错

    ```
      encountered an unexpected result code from the portal ('4550')
      2018-11-16 11:38:05.273 xcodebuild[51268:768470] [MT] DVTPortal: Error:
      Error Domain=DVTPortalServiceErrorDomain Code=4550 "The selected team's agent, Yunfeng Hu must agree to the latest Program License Agreement in their developer account. https://developer.apple.com/account/" UserInfo={payload=<CFBasicHash 0x7ffaece97280 [0x7fff9395c8e0]>{type = mutable dict, count = 10,
      entries =>
      0 : <CFString 0x7ffaeceaac20 [0x7fff9395c8e0]>{contents = "requestId"} = <CFString 0x7ffaef91d250 [0x7fff9395c8e0]>{contents = "85E58A79-61D5-41C4-96E1-A7A5FD6A34C6"}
      1 : responseId = <CFString 0x7ffaecea0de0 [0x7fff9395c8e0]>{contents = "3b306d0d-5e92-4b73-969a-4267b9207acf"}
      2 : <CFString 0x7fff939bcd08 [0x7fff9395c8e0]>{contents = "protocolVersion"} = QH65B2
      3 : <CFString 0x7ffaecea1090 [0x7fff9395c8e0]>{contents = "requestUrl"} = <CFString 0x7ffaecea23a0 [0x7fff9395c8e0]>{contents = "https://developerservices2.apple.com/services/QH65B2/ios/listDevices.action"}
      6 : <CFString 0x7ffaece89da0 [0x7fff9395c8e0]>{contents = "userLocale"} = en_US
      8 : resultCode = <CFNumber 0xbdc97b04085cc1c5 [0x7fff9395c8e0]>{value = +4550, type = kCFNumberSInt64Type}
      9 : userString = <CFString 0x7ffaecea3fb0 [0x7fff9395c8e0]>{contents = "The selected team's agent, Yunfeng Hu must agree to the latest Program License Agreement in their developer account. https://developer.apple.com/account/"}
      10 : <CFString 0x7ffaeceaabe0 [0x7fff9395c8e0]>{contents = "resultString"} = <CFString 0x7ffaecea4980 [0x7fff9395c8e0]>{contents = "Program License Agreement updated"}
      11 : httpCode = <CFNumber 0xbdc97b04084dcfc5 [0x7fff9395c8e0]>{value = +200, type = kCFNumberSInt64Type}
      12 : <CFString 0x7ffaece99d10 [0x7fff9395c8e0]>{contents = "creationTimestamp"} = <CFString 0x7ffaece96f50 [0x7fff9395c8e0]>{contents = "2018-11-16T03:38:05Z"}
    }
    , NSLocalizedDescription=The selected team's agent, Yunfeng Hu must agree to the latest Program License Agreement in their developer account. https://developer.apple.com/account/}
    ```

  * 此处原因是团队成员访问描述文件必须经过主账号（代理人）的同意。否则有导出ipa包错误 [详情参考](https://www.crifan.com/xcode_archive_package_error_communication_with_the_apple_developer_website_failed/)

7. .app 文件夹怎么用命令打开。来 获取内部资源