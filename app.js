const express = require('express')
const path = require('path')

const app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认找到的就是 views目录下的文件  可以修改为指定的目录

app.get('/', (req, res) => {
    res.render('index.html', {
        msg: '欢迎来到首页!!!'
    })
})

app.listen(8080, () => console.log('Server is running on http://127.0.0.1:8080'))