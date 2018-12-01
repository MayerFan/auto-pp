'use strict'

module.exports = {
  checkMobile : checkisMobile,
  checkIos    : checkisiOS,
  checkAndriod: checkisAndriod,
  dateFormater: formatDate
}

// 检测是否是移动设备
function checkisMobile(req) {
  const ua = req.headers['user-agent'].toLowerCase()
  if (ua.match('mobile')) { //移动设备
    return true
  }
  return false
}

// 检测是否是iOS设备
function checkisiOS(req) {
  const ua = req.headers['user-agent'].toLowerCase()
  if (ua.match('phone')) {
    return true
  } 
  return false
}

// 检测是否是Andriod设备
function checkisAndriod(req) {
  const ua = req.headers['user-agent'].toLowerCase()
  if (ua.match('andriod')) {
    return true
  } 
  return false
}

// time 时间戳
function formatDate(time,format='YY-MM-DD hh:mm:ss'){
  if (!time || time == '') return ''
  var date = new Date(parseInt(time));

  var year = date.getFullYear(),
      month = date.getMonth()+1,//月份是从0开始的
      day = date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();
  var preArr = Array.apply(null,Array(10)).map(function(elem, index) {
      return '0'+index;
  });////开个长度为10的数组 格式为 00 01 02 03

  var newTime = format.replace(/YY/g,year)
                      .replace(/MM/g,preArr[month]||month)
                      .replace(/DD/g,preArr[day]||day)
                      .replace(/hh/g,preArr[hour]||hour)
                      .replace(/mm/g,preArr[min]||min)
                      .replace(/ss/g,preArr[sec]||sec);

  return newTime;         
}