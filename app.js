const express = require('express')
const path = require('path')
const router = require('./router')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认找到的就是 views目录下的文件  可以修改为指定的目录

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))
// parse application/json
app.use(bodyParser.json())

app.use(session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'test',
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
}))

// 把路由挂在到 app 中
app.use(router)

// 配置一个处理404页面的中间件  此处只有当前面的中间件都没有被执行的时候 才会执行这个最后的中间件
app.use((req, res, next) => {
    res.render('404.html', {
        title: '错误页面'
    })
})

/*
 * 配置一个 全局错误处理的中间件  
 * 为什么 写在路由 app.use(router) 的后方：
 * 因为 return在路由中执行 而next(err)则是跳转到下一个中间件 下一个与之对应的中间件就是当前存在四个参数的err
 */
app.use((err, req, res, next) => {
    res.status(500).json({
        err_code: 500,
        message: err.message
    })
})


app.listen(8080, () => console.log('Server is running on http://127.0.0.1:8080'))