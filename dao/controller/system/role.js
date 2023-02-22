const { roleModel } = require('../../model/system/role.js')

/**
 * 获取角色列表
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const role_list_data = async(req, res) => {
    const data = await roleModel.find({});
    res.json({
        code: 200,
        mes: "获取成功",
        data: {
            list: data
        }
    })
}

/**
 * 获取用户列表
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const role_list_data_page = async(req, res) => {
    let { pageNum, pageSize } = req.query;
    const limitNum = parseInt(pageSize);
    const skipNum = (parseInt(pageNum) - 1) * limitNum;
    const findParams = {}
    const orWhere = []
    const orParams = []
    // if(status) Object.assign(findParams, {'user.status': status, 'user.deptId': deptId})
    // if(keywords) orWhere.forEach(item => {
    //     if(item == 'nickName'){
    //         orParams.push({[`user.${item}`]: {
    //             $regex: keywords
    //         }})
    //     }else{
    //         orParams.push({[`user.${item}`]: keywords})
    //     }
    // })
    const data = await roleModel.find(findParams).or(orParams).skip(skipNum).limit(limitNum);

    console.log(data)
    let list = [];
    data.forEach((item, index) => {
        list.push(item)
    })
    res.json({
        code: 200,
        mes: "获取成功",
        data: {
            list: list,
            total: data.length
        }
    })
}

exports.default = {
    role_list_data, role_list_data_page
}