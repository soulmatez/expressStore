const { menuModel } = require('../../model/system/menu.js')
const { recursionArray } = require('../../../utils/index').default


/**
 * 处理登录操作
 * @param {*} req 
 * @param {*} res 
 */
const get_menu_router = async (req,res) => {
	//这里演示查询所有用户,find不传参数为查询所有用户
    const data = await menuModel.find(req.body)
    res.json({
        code: 200,
		mes:"获取成功",
        data
	})
}  

/**
 * 获取菜单下拉列表
 * @param {*} req 
 * @param {*} res 
 */
const get_menu_select = async (req,res) => {
	//这里演示查询所有用户,find不传参数为查询所有用户
    const data = await menuModel.find(req.body)
    res.json({
        code: 200,
		mes: "获取成功",
        data: recursionArray(data)
	})
}

exports.default = {
    get_menu_router, get_menu_select
}