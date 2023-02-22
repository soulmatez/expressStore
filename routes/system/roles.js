var express = require('express');
var router = express.Router();
var roleController = require('../../dao/controller/system/role.js').default
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resources');
});

/**
 * 角色管理
 *  - 获取角色列表
 */
router.get("/getRoleList", roleController.role_list_data)
router.get("/getRoleListPage", roleController.role_list_data_page)  //分页



module.exports = router;
