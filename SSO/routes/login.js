const router = require('koa-router')()

function isToken (token){
    return token && token === 'passport';
}

router.get('/',async (ctx) => {
    //获取cookies
    const cookies = ctx.cookies
    //从cookies中拿出token
    const token = cookies.get('token')
    //token验证通过则重定向 不然则登录页面
    if (token && isToken(token)) {
        const redirect = ctx.query.redirectUrl;
        if (redirect) {
            ctx.redirect(`${ctx.protocol}://${redirect}?token=${token}`)
        } else {
            ctx.body = "<h1>你好！ 登录成功！</h1>"
        }
    } else {
        await ctx.render('index.ejs',{
            extension:'ejs'
        })
    }
})

router.post('/',async (ctx) => {
    const body = ctx.request.body
    console.log(`ctx.request`,ctx.request.body)
    const {name,password} = body
    if (name && password==='123456') {
        //把token放到cookie里面
        const token = "passport";
        await ctx.cookies.set('token',token,{
            maxAge:1000*60*60*24*30,
            httpOnly:true
        })
        //查找重定向路径 有则重定向，否则显示登录成功
        if (ctx.query.redirectUrl) {
            ctx.redirect(`${ctx.protocol}://${ctx.query.redirectUrl}?token=${token}`)
        } else {
            ctx.body="<h1>你好！ 登录成功！</h1>"
        }
    } else {
        //错误响应返回
        ctx.response.body = {
            code:403,
            message:"亲！密码错误了"
        }
    }
})

module.exports = router
