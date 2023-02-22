const svgCaptcha = require("svg-captcha")  // 加载图片验证码模块+
const moment = require('moment');  //时间戳插件
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
function recursionArray(arr) {
    const array = [];
    arr.forEach(item => {
        const it = JSON.parse(JSON.stringify(item))
        Object.assign(it, {
            label: it.meta.title
        })
        array.push(it)
        if(it.children && it.children.length > 0){
            it.children = recursionArray(it.children)
        }
    })
    return array;
}

exports.default = {
    setCaptcha, format, noRepeat, recursionArray
}