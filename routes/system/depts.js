var express = require('express');
var router = express.Router();
var deptController = require('../../dao/controller/system/dept.js').default
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resources');
});

/**
 * 部门管理
 *  - 获取部门列表
 */
router.get("/getDeptList", deptController.dept_list_data)

module.exports = router;
