const svgCaptcha = require("svg-captcha")  // 加载图片验证码模块+
const moment = require('moment');  //时间戳插件
var mongoose = require('mongoose');
/**
 * 生成验证码
 */
function setCaptcha(){
    // 设置字母随机验证码相关属性
    let options = {
        size: 4, // 4个字母
        noise: 2, // 干扰线2条
        color: true, // 文字颜色
        background: "#2d3a4b", // 背景颜色
        // 数字的时候，设置下面属性。最大，最小，加或者减
        // mathMin: 1,
        // mathMax: 30,
        // mathOperator: "+",
    }
    //这里可以分为字母和数字随机验证码和数字算数随机验证码,
    //我就先展示字母和数字随机验证码了,
    //如果想尝试数字算数随机验证码可以将下一行取消注释,将数字算数验证码解开注释即可
    let captcha = svgCaptcha.create(options) //字母和数字随机验证码
    // let captcha = svgCaptcha.createMathExpr(options) //数字算数随机验证码
    return captcha;
}

/**
 * 生成MongoDb的ObjectId (24位  )
 */
function ObjectId(){
    return mongoose.Types.ObjectId();
}

/**
 * 生成树形结构
 * @param {*} b 
 * @returns 
 */
Array.prototype.toTree = function(_id){
    let tree = [];
    for(let i=0;i<this.length;i++){
        if(this[i].parentId == _id){
            this[i].children = this.toTree(this[i]._id);
            tree.push(this[i]);
        }
    }
    return tree;
}

/**
 * 数组原型方法
 */
Array.prototype.remove = function(b) {
    var a = this.indexOf(b);
    if (a >= 0) {
        this.splice(a, 1);
        return true;
    }
    return false;
};

/**
* 删除数组中指定对象
* @param {OBject} arr 
* @param {function} func 返回ture或false
*/
function arrDelete(arr, func) {
    let isFind = false;
    arr.forEach((item, i) => {
        if (func(item)) {
            arr.splice(i, 1);
            isFind = true;
            return;
        }
    })
    return isFind;
}

/**
 * 获取当前时间
 * form_type: 时间格式
 */
function format(formType){
    var current_time = moment(Date.now()).format(formType)
    return current_time;
}

/**
 * 数组去重
 * arr: 目标数组
 */
function noRepeat(arr) {
    for(var i = 0; i < arr.length-1; i++){
        for(var j = i+1; j < arr.length; j++){
            if(arr[i]===arr[j]){
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
}

/**
 * 数组递归
 */
function recursionRoleArray(arr, roleArr) {
    const array = [];
    arr.forEach(item => {
        const it = JSON.parse(JSON.stringify(item))
        let limitValue = [];
        console.log(it.meta)
        it.meta.roleIds.forEach(rid => {
            limitValue.push(roleArr.filter(value => rid == value._id)[0]['role'])
        })
        Object.assign(it.meta, {
            roles: limitValue
        })
        // delete it.meta.roleIds
        array.push(it)
        if(it.children && it.children.length > 0){
            it.children = recursionRoleArray(it.children, roleArr)
        }
    })
    array.sort(compare('meta'))
    return array;
}

function recursionOtherArray(arr) {
    const array = [];
    arr.forEach(item => {
        const it = JSON.parse(JSON.stringify(item))
        Object.assign(it, {
            label: it.meta.title,
            value: it._id,
            visible: it.meta.hidden ? false : true
        })
        array.push(it)
        if(it.children && it.children.length > 0){
            it.children = recursionOtherArray(it.children)
        }
    })
    array.sort(compare('meta'))
    return array;
}

/**
 * 数组排序
 */
function compare(property) {//property:根据什么属性排序
    return function(a,b){
        var value1 = a[property]['sort'];
        var value2 = b[property]['sort'];
        /*
        * value2 - value1; ——> 降序
        * value1 - value2; ——> 升序
        */
        return value2 - value1;//升序排序
    }
}

/**
 * 多维数组拆分一维数组
 */
function splitArray(array, newArr = []) {
    array.forEach(item => {
        newArr.push(item)
        if(item.children){
            splitArray(item.children, newArr)
        }
    })
    return newArr;
}

/**
 * 删除节点
 */
function removeNode(array, filter){
    array.forEach((item, index) => {
        if(item._id == filterId){
            array.splice(index, 1)
            return;
        }
        if(item.children){
            item.children = removeNode(item.children, filterId)
        }
    })
    return array
}



exports.default = {
    setCaptcha, format, noRepeat, recursionOtherArray, recursionRoleArray, splitArray,
    ObjectId, arrDelete
}