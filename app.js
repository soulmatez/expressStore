var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs')
const { verToken, signkey } = require("./utils/authotoken").default
const { userModel } = require('./dao/model/user.js')

require('./config/database.js')

var loginRouter = require('./routes/login');
var menuRouter = require('./routes/menu');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cookieParser())

//  注意app.all要写在  app.use之前
app.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin","*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers","content-type");
  //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");


  // 设置路由白名单，免除jwt权限校验
  var whiteRouterList = [
    '/oauth/captchaImage', 
    '/oauth/login'
  ];
  // 获取当前访问的api地址
  const url = req._parsedUrl.pathname;
  if (whiteRouterList.indexOf(url) >= 0) {
    next()
    return false
  }
  // 获取token
  var token = req.headers['authorization'];
  if(token == undefined){
    res.status(401).json({
      code: 401
    }) 
  }else{
    verToken(token).then(async (data)=> {
      const userData = await userModel.findOne({ 
          'user.userName': data.name, 
          '_id': data._id 
      });
      
      if(req.cookies.token != undefined){
        //说明jwt已经过期了，cookie需要在这里进行延期
        // 说明过期，cookie还没有需要存储cookie
        if(parseInt(data.exp) * 1000 - new Date().getTime() < 1000 * 600){
          res.cookie('token', token, { maxAge: 600 * 1000, httpOnly: true });
        }
        next();
      }else{
        if(userData != null){
          // 说明过期，cookie还没有需要存储cookie
          if(parseInt(data.exp) * 1000 - new Date().getTime() < 0){
            res.cookie('token', token, { maxAge: 600 * 1000, httpOnly: true });
          }
          next();
        }else{
          res.status(401).json({
            code: 402,
            msg: '用户状态异常，请重新登录！'
          })  
        }
      }
    }).catch((error)=>{
      res.status(401).json({
        code: 402,
        msg: '用户状态异常，请重新登录！'
      }) 
    })
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//修改视图为html文件
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/oauth', loginRouter);
app.use('/menus', menuRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
