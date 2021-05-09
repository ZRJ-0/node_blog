const express = require('express')
const md5 = require('blueimp-md5')
const router = express.Router()
const User = require('./models/user')

router.get('/', (req, res) => {
    res.render('index.html')
})

router.get('/login', (req, res) => {
    res.render('login.html')
})

router.post('/login', (req, res) => {

})

router.get('/register', (req, res) => {
    res.render('register.html')
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
            return res.status(200).json({
                err_code: 1,
                message: 'Email or Nickname is already exists.'
            })
        }

        body.password = md5(md5(body.password))
        new User(body).save((err, user) => {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Internal Error.'
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