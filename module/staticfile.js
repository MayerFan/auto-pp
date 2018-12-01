'use strict'

const fs = require('fs')
const path = require('path')

function fetchStaticFile(req, res) {
  var filePath = req.path
  filePath = path.join('./', filePath)

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      fs.createReadStream(filePath).pipe(res)
    }
  })
}


module.exports = fetchStaticFile