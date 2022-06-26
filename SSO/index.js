const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const bodyparser = require('koa-bodyparser')
const path = require('path')
const login = require('./routes/login')
const verifyToken = require('./routes/token')
const app = new Koa()
const router = new Router()
//参数解析中间件
app.use(bodyparser());
//模版中间价
app.use(views(path.join(__dirname,'./views')),{
    extension:'ejs'
})
//路由中间件 注册路由
router.use('/verifyToken',verifyToken.routes())
router.use('/login',login.routes())
//挂载路由
app.use(router.routes())
//服务启动
app.listen(8001,() => {
    console.log("服务启动成功8001")
})
