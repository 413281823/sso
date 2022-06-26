const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const path = require('path')
const app = new Koa()
const router = new Router()
const session = require('koa-session')
const koa2Req = require('koa2-request')
//path 路径模块
app.use(views(path.join(__dirname,'./views')), {
    extension:"ejs"
})
//🔐
app.keys=['kye']

const SSO_PORT = 8001

const keyMap = {
    '8002':'koa:sess8002',
    '8003':'koa:sess8003'
}

const CONFIG = {
    key:keyMap[process.env.PORT] || 'koa:sess',
    maxAge:1000*60*60*24,
    httpOnly:true
}

app.use(session(CONFIG,app))

const system = '子系统'
const userName = "你自己"

router.get("/",async (ctx) => {
    let user = ctx.session.user
    //拿到session里面的数据
    console.log('session',ctx.session)
    //如果有user
    if (user) {
        await ctx.render('index.ejs',{
            user,
            system,
            userName
        })
    } else {
        //如果没有user 查找是否携带token
        let token = ctx.query.token
        //如果没有携带token直接重定向到登录页面并且携带当前URL
        if (!token) {
            ctx.redirect(`http://localhost:${SSO_PORT}/login?redirectUrl=${ctx.host+ctx.originalUrl}`)
        } else {
            //第二次进入的时候走这一步，因为你有了token 发请求给认证服务器验证你的token
            const url = `://localhost:${SSO_PORT}/verifyToken?token=${token}&t=${new Date().getTime()}`
            //ctx.protocol=当前的网络协议 
            let res = await koa2Req(ctx.protocol + url)
            console.log(res)
            if (res && res.body) {
                try {
                    const body = JSON.parse(res.body)
                    const {code,userId} = body;

                    if (code===200) {
                        if (!userId) {
                            console.log(ctx.originalUrl)
                            ctx.redirect(`http://localhost:${SSO_PORT}/login?redirectUrl=${ctx.host+ctx.originalUrl}`)

                        }
                        //给session赋值
                        ctx.session.user= userId;
                        await ctx.render('index.ejs',{
                            user:userId,
                            system,
                            userName
                        })

                    } else {
                        ctx.redirect(`http://localhost:${SSO_PORT}/login?redirectUrl=${ctx.host+ctx.originalUrl}`)
                    }

                }catch(e) {
                    console.error(e)
                }
            }
        }
    }
})
//挂载路由
app.use(router.routes())
const port = process.env.PORT || 9999

app.listen(port, () =>{
    console.log(`服务启动成功${port}`)
})
