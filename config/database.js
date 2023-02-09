const {connect,connection} = require('mongoose');
const config = require('../package.json');

// 设置要连接的 MongoDB 服务器地址(studentsManage:要连接的数据库名称)
const dbURI = `${config.db.url}/${config.db.dbname}`;

// 连接数据库
connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

//当数据库连接成功时触发此事件
connection.on('connected', () => console.log('\033[40;32m MongoDB Sever is Running Success\033[0m'));
