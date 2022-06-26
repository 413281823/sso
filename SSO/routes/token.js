const router = require('koa-router')()
function isToken(token) {
    return token && token==='passport'
}

router.get('/',async (ctx) => {
    const token = ctx.query.token
    console.log(token)
    const result = {
        code:403
    }
    //检查token token✅的话code为200 且🆔为admin
    if (isToken(token)) {
        result.code = 200
        result.userId = 'admin'
    }
    ctx.body=result
})

module.exports = router
