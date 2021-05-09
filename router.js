const express = require('express')
const md5 = require('blueimp-md5')
const router = express.Router()
const User = require('./models/user')

router.get('/', (req, res, next) => {
    res.render('index.html', {
        user: req.session.user
    })
})

router.get('/login', (req, res, next) => {
    res.render('login.html', {
        title: '登录页面'
    })
})

router.post('/login', (req, res, next) => {
    const body = req.body
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, (err, user) => {
        if (err)
            // return res.status(500).json({
            //     err_code: 500,
            //     message: err.message
            // })
            return next(err)
        // 如果头像和密码匹配   则user是查询到的用户对象    否则是null
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            })
        }

        // 用户存在 登录成功    通过Session记录登录状态
        req.session.user = user

        return res.status(200).json({
            err_code: 0,
            message: 'Login Success'
        })
    })
})

router.get('/register', (req, res, next) => {
    res.render('register.html', {
        title: '注册页面'
    })
})

router.post('/register', (req, res, next) => {
    const body = req.body
    User.findOne({
        $or: [{
            email: body.email
        }, {
            nickname: body.nickname
        }]
    }, (err, data) => {
        if (err)
            // return res.status(500).json({
            //     success: false,
            //     message: 'Server Error!!!'
            // })
            return next(err)
        if (data) {
            // 邮箱或者昵称已存在
            return res.status(200).json({
                err_code: 1,
                message: 'Email or Nickname is already exists.'
            })
            // return res.render('register.html', {
            //     // 生成错误信息到注册表格上侧
            //     err_msg: '邮箱或密码已存在',
            //     // 接受返回post同步表单提交的请求体数据 body 
            //     // 然后将其渲染到input表单当中 使得刷新页面还能显示原有的信息 原来没有ajax都是通过这种形式
            //     form: body
            // })
        }

        body.password = md5(md5(body.password))
        new User(body).save((err, user) => {
            if (err) {
                // return res.status(500).json({
                //     err_code: 500,
                //     message: 'Internal Error.'
                // })
                return next(err)
                // return res.render('register.html', {
                //     err_msg: 'Internal Error.',
                //     form: body
                // })
            }
            // console.log(user) // 输出的就是body对象中的数据

            // 注册成功 使用Session记录用户的登录状态
            // 需要在app中现进行配置    才能使用
            req.session.user = user

            // Express 提供了一个响应方法：json
            // 该方法接受了一个对象作为参数， 他会自动帮你将对象转化为字符串再发送给浏览器
            res.status(200).json({
                err_code: 0,
                message: 'Register Success'
            })

            // 服务端重定向只针对同步请求才有效，异步请求无效
            // res.redirect('/')
        })

    })
})

router.get('/logout', (req, res, next) => {
    /*
     * 将 req.session.user 这个对象删除掉
     * 也可以使用 req.session.user = null  但此时这个键还存在只是值变为null了 不如直接 delete
     */
    delete req.session.user

    // 重定向到登录页
    res.redirect('/login')
})

module.exports = router

// router.post('/register', async function (req, res) {
//   var body = req.body
//   try {
//     if (await User.findOne({ email: body.email })) {
//       return res.status(200).json({
//         err_code: 1,
//         message: '邮箱已存在'
//       })
//     }

//     if (await User.findOne({ nickname: body.nickname })) {
//       return res.status(200).json({
//         err_code: 2,
//         message: '昵称已存在'
//       })
//     }

//     // 对密码进行 md5 重复加密
//     body.password = md5(md5(body.password))

//     // 创建用户，执行注册
//     await new User(body).save()

//     res.status(200).json({
//       err_code: 0,
//       message: 'OK'
//     })
//   } catch (err) {
//     res.status(500).json({
//       err_code: 500,
//       message: err.message
//     })
//   }
// })