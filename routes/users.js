var express = require('express');
var router = express.Router();
var loginController = require('../dao/controller/login.js').default

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resources');
});

// 添加
router.get('/find', function (req, res, next) {
  console.log(req, res, next)
})

router.get("/getUserInfo", loginController.employee_find)

module.exports = router;
