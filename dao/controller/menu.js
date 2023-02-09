const { menuModel } = require('../model/menu.js')

//处理登录操作
const get_menu_router = async (req,res) => {
	//这里演示查询所有用户,find不传参数为查询所有用户
    const data = await menuModel.find(req.body)
    res.json({
        code: 200,
		mes:"获取成功",
        data
	})
}  

exports.default = {
    get_menu_router
}