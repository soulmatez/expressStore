const { menuModel } = require('../../model/system/menu.js')
const { roleModel } = require('../../model/system/role.js')
const { recursionOtherArray, recursionRoleArray } = require('../../../utils/index').default


/**
 * 处理登录操作
 * @param {*} req 
 * @param {*} res 
 */
const get_menu_router = async (req,res) => {
	//这里演示查询所有用户,find不传参数为查询所有用户
    const data = await menuModel.find();
    const role = await roleModel.find({});
    res.json({
        code: 200,
		msg:"获取成功",
        data: recursionRoleArray(data.toTree('0'), role)
	})
}  

/**
 * 获取菜单下拉列表
 * @param {*} req 
 * @param {*} res 
 */
const get_menu_select = async (req,res) => {
	//这里演示查询所有用户,find不传参数为查询所有用户
    const data = await menuModel.find(req.body);
    res.json({
        code: 200,
		msg: "获取成功",
        data: recursionOtherArray(data.toTree("0"))
	})
}

/**
 * 获取菜单表格
 * @param {*} req 
 * @param {*} res 
 */
const get_menu_table = async (req,res) => {
	//这里演示查询所有用户,find不传参数为查询所有用户
    let { name } = req.body;
    const findParams = {}
    if(name) Object.assign(findParams, { 'meta.title': name })
    const data = await menuModel.find(findParams);
    res.json({
        code: 200,
		msg: "获取成功",
        data: recursionOtherArray(data.toTree("0"))
	})
}

/**
 * 获取菜单详情
 * @param {*} req 
 * @param {*} res 
 */
const get_menu_detail = async (req,res) => {
    let { id, pid } = req.params;
    let data = await menuModel.findById(id);
    res.json({
        code: 200,
		msg: "获取成功",
        data: data
	})
}

/**
 * 新增菜单
 * @param {*} req 
 * @param {*} res 
 */
const menu_add_controller = async (req,res) => {
    console.log('dadada');
    return;
    let menuMo = req.body;
    data = await menuModel.create(menuMo);
    res.json({
        code: 200,
		msg: "新增成功",
        data
	})
}

/**
 * 修改菜单内容
 * @param {*} req 
 * @param {*} res 
 */
const menu_update_controller = async (req,res) => {
    let { id } = req.params;
    let menuMo = req.body;
    data = await menuModel.updateOne({ _id: id }, menuMo);
    res.json({
        code: 200,
		msg: "修改成功",
        data: data
	})
}

/**
 * 删除菜单内容
 * @param {*} req 
 * @param {*} res 
 */
const menu_del_controller = async (req,res) => {
    let { id } = req.params;
    let menuRow = await menuModel.find({ parentId: id });
    if(menuRow.length){
        res.json({
            code: 500,
            msg: "删除失败，该菜单下面还存在其他子菜单"
        })
        return;
    }
    data = await menuModel.remove({ _id: { $in: id.split(',') } });
    res.json({
        code: 200,
        msg: "删除成功",
        data
    })
}

/**
 * 获取菜单权限
 * @param {*} req 
 * @param {*} res 
 */
const menu_getPerm_controller = async (req,res) => {
    let { pageNum, pageSize, menuId } = req.body;
    const limitNum = parseInt(pageSize);
    const skipNum = (parseInt(pageNum) - 1) * limitNum;
    let data = await menuModel.findById(menuId);
    let permissions = {
        list: data.meta.permissions,
        total: data.meta.permissions.length
    }
    res.json({
        code: 200,
		msg: "获取成功",
        data: permissions
	})
}

/**
 * 新增菜单权限
 * @param {*} req 
 * @param {*} res 
 */
const menu_addPerm_controller = async (req,res) => {
    console.log(1);
    // return;
    let { btnPerm, name, menuId } = req.body;
    let obj = { btnPerm, name }
    const data = await menuModel.updateOne({
        _id: menuId
    },{
        $addToSet: { "meta.permissions": {
            btnPerm, name
        }}
    });
    res.json({
        code: 200,
		msg: "获取成功",
        data: data
	})
}

exports.default = {
    get_menu_router, get_menu_select, get_menu_table, get_menu_detail,
    menu_add_controller, menu_update_controller, menu_del_controller,
    menu_getPerm_controller, menu_addPerm_controller
}