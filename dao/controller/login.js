const { userModel } = require('../model/user.js')
const { setToken } = require("../../utils/authotoken").default
const { setCaptcha } = require("../../utils/index").default
const { _pubkey, _prikey, decrypt } = require('../../utils/keyStore').default


//处理登录操作
const employee_login = async(req, res) => {
    let { username, password } = req.body;
    const data = await userModel.findOne({ 
        'user.userName': username, 
        'user.password': decrypt(_prikey, password) 
    });
    if(data != null){
        // 生成token
        setToken(username, data._id).then((token) => {
            console.log(username, data._id)
            res.json({
                code: 200,
                mes: "登录成功",
                data: {
                    access_token: token,
                    token_type: 'token'
                }
            })
        })
        
    }else{
        res.json({
            code: 200,
            mes: "用户名或密码不正确"
        })
    }
        
    
}

//处理注册操作
const employee_sign = async (req, res) => {
    const data = await userModel.create(req.body)
    res.json(data)
}

//处理注销操作
const employee_logout = (req, res) => {
    res.json({
        code: 200,
        mes: "注销成功"
    })
}

//用户查询操作
const employee_find = async (req, res) => {
    //这里演示查询所有用户,find不传参数为查询所有用户
    const data = await userModel.findOne(req.body)
    res.json({
        code: 200,
        mes: "登录成功",
        data
    })
}

//验证码获取
const employee_captcha = async (req, res) => {
    let { text, data } = setCaptcha()
    // text是指产生的验证码，data指svg的字节流信息
    res.type("svg")
    res.json({
        code: 200,
        data: {
            img: data,
            text: text,
            uuid: _pubkey
        }
    })
}

exports.default = {
    employee_login, employee_sign, employee_find, employee_logout, employee_captcha
}