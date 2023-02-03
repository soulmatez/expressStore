const { userModel } = require('../model/user.js')

//处理登录操作
const employee_login = (req,res) => {
	res.json({
		mes:"登录成功"
	})
}   

//用户查询操作
const employee_find = async (req, res) => {
    //这里演示查询所有用户,find不传参数为查询所有用户
    const data = await userModel.find(req.body)
    res.json(data)
}

//处理注册操作
const employee_sign = async (req, res) => {
    const data = await userModel.create(req.body)
    console.log(data)
    res.json(data)
} 

exports.default = {
    employee_login, employee_sign, employee_find
}