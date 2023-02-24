const { deptModel } = require('../../model/system/dept.js')

/**
 * 获取部门列表
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const dept_list_data = async(req, res) => {
    const data = await deptModel.find({});
    res.json({
        code: 200,
        msg: "获取成功",
        data: {
            list: data
        }
    })
}

exports.default = {
    dept_list_data
}