const express = require('express')
const md5 = require('blueimp-md5')
const router = express.Router()
const User = require('./models/user')

router.get('/', (req, res) => {
    if (req.session.user) {
        res.render('index.html', {
            user: req.session.user
        })
    } else {
        res.render('index.html')
    }
})

router.get('/login', (req, res) => {
    res.render('login.html')
})

router.post('/login', (req, res) => {

})

router.get('/register', (req, res) => {
    res.render('register.html', {
        title: '注册页面'
    })
})

router.post('/register', (req, res) => {
    const body = req.body
    User.findOne({
        $or: [{
            email: body.email
        }, {
            nickname: body.nickname
        }]
    }, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Server Error!!!'
            })
        }
        if (data) {
            // 邮箱或者昵称已存在
            // return res.status(200).json({
            //     err_code: 1,
            //     message: 'Email or Nickname is already exists.'
            // })
            return res.render('register.html', {
                // 生成错误信息到注册表格上侧
                err_msg: '邮箱或密码已存在',
                // 接受返回post同步表单提交的请求体数据 body 
                // 然后将其渲染到input表单当中 使得刷新页面还能显示原有的信息 原来没有ajax都是通过这种形式
                form: body
            })
        }

        body.password = md5(md5(body.password))
        new User(body).save((err, user) => {
            if (err) {
                // return res.status(500).json({
                //     err_code: 500,
                //     message: 'Internal Error.'
                // })
                return res.render('register.html', {
                    err_msg: 'Internal Error.',
                    form: body
                })
            }
            // console.log(user) // 输出的就是body对象中的数据

            // 注册成功 使用Session记录用户的登录状态
            // 需要在app中现进行配置    才能使用
            req.session.user = user

            // Express 提供了一个响应方法：json
            // 该方法接受了一个对象作为参数， 他会自动帮你将对象转化为字符串再发送给浏览器
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })

            // 服务端重定向只针对同步请求才有效，异步请求无效
            // res.redirect('/')
        })

    })
})

router.get('/logout', (req, res) => {

})

module.exports = router