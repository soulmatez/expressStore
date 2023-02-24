var express = require('express');
var router = express.Router();
var dictController = require('../../dao/controller/system/dict.js').default
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resources');
});

/**
 * 部门管理
 *  - 获取部门列表
 */
router.get("/getDict/:code", dictController.get_dict_detail)

module.exports = router;
