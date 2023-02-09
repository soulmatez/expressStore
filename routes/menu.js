var express = require("express")
var router = express.Router()
var menuController = require('../dao/controller/menu.js').default

/** 获取菜单 */
router.get("/route", menuController.get_menu_router)

//导出router
module.exports = router;