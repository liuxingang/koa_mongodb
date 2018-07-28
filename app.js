var path = require('path');
var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var static = require('koa-static');
var router = require('koa-router')();
var views = require('koa-views');
var render = require('koa-art-template');
var session = require('koa-session');
var DB = require('./module/db');

var app = new Koa();

render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));

app.use(static(__dirname + '/static'))
app.use(bodyParser());


// 配置公共信息数据

app.use(async (ctx, next) => {
    ctx.state = {
        userInfo: '张三'
    }
    await next()
})

router.get('/', async (ctx) => {
    let list = {
        name: '张三',
        content: '<h1 style="color:red;">dadaa</h1>'
    }
    var result = await DB.find('user', {})


    await ctx.render('index', {
        list: result
    })
})
router.get('/add', async (ctx) => {

    await ctx.render('add')
})
router.post('/doAdd', async (ctx) => {
    let data = await DB.insert('user', ctx.request.body)
    try {
        if (data.result.ok) {
            ctx.redirect('/')
        }
    } catch (err) {
        ctx.redirect('/add')
    }
})

router.get('/edit', async (ctx) => {
    let id = ctx.query.id;
    let data = await DB.find('user', { "_id": DB.getObjectId(id) })
    await ctx.render('edit', {
        data: data[0]
    })
})

router.post('/doEdit', async (ctx) => {
    let body = ctx.request.body;
    let id = DB.getObjectId(body.id)
    let { username, age, sex } = body
    let data = await DB.update('user', { "_id": id }, {
        username,
        age,
        sex
    })
    try {
        if (data.result.ok) {
            ctx.redirect('/')
        }
    } catch (err) {
        ctx.redirect('/add')
    }
})

router.get('/delete', async (ctx) => {
    let id = ctx.query.id;
    let data = await DB.remove('user', { "_id": DB.getObjectId(id) })
    try {
        if (data.result.ok) {
            ctx.redirect('/')
        }
    } catch (err) {
        ctx.redirect('/')
    }
})

app.use(router.routes())
app.use(router.allowedMethods)

app.listen(3000)
console.log('server is running 3000')
