var express = require("express")
var router = express.Router()
var menuController = require('../../dao/controller/system/menu.js').default

/** 获取菜单 */
router.get("/route", menuController.get_menu_router)

/** 获取菜单 */
router.get("/select", menuController.get_menu_select)

//导出router
module.exports = router;