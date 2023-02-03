var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resources');
});

// 添加
router.get('/find', function (req, res, next) {
  console.log(req, res, next)
})



module.exports = router;
