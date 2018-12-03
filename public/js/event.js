'use strict'

jQuery(function(){

  var data = $('#leftside td').data('select')
  if (data) {
    $('#leftside').removeClass('disabled')
    $('#leftside').addClass('active')
  }

	$('.qrselect').on('mouseenter',function(event){ 
    var eventEle = event.currentTarget
    var version = $(eventEle).children('.version').text()
    var build = $(eventEle).children('.build').text()
    var hostname = location.hostname
    var text = "itms-services://?action=download-manifest&url=https://" + hostname + ":8002/files/58COIN_" + version + '_' + build + '.plist'
    $('#code').qrcode({
      render: "canvas", //也可以替换为table
      width: 220,
      height: 220,
      text: text
    });
  });

  $('.qrselect').on('mouseleave',function(){ 
    $('#code').empty()
  });

  $('.home_ios').on('click', () => {
    window.location.href = '/app/ios/'
  });

  $('.home_andriod').on('click', () => {
    window.location.href = '/app/andriod/'
  });

  $('#nav-plat').on('click', (event)=> {
    var eventEle = event.currentTarget
    var text = $(eventEle).text()
    window.location.href = '/app/' + text + '/'
  })
})