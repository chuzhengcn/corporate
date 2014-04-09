// --------------------------------------------------------------------------------
var operators = [
    {
        name        : "xiaoxiong",
        password    : "123456",
    }
]
// --------------------------------------------------------------------------------
function index(req, res) {
    res.render('xiaoxiong/admin/login')
}

exports.index = index;

// --------------------------------------------------------------------------------
function login(req, res) {
    check_operator_validation(req.body, function(err, is_valid) {
        if (err || !is_valid) {
            res.send({ok : 0, msg : "用户名或者密码错误"})
            return
        }

        req.session.login = true
        res.send({ok : 1})
    })
}

exports.login = login

// --------------------------------------------------------------------------------
function check_login(req, cb) {
    if (!req.session.login) {
        req.session = null
        cb(null, false)
        return
    }

    if (req.session.login === true) {
        cb(null, true)
        return
    }

    cb(null, false)
}
exports.check_login = check_login

// --------------------------------------------------------------------------------
function check_operator_validation(operator_info, cb) {
    var is_valid = false;

    operators.forEach(function(item) {
        if (item.name === operator_info.name && item.password === operator_info.password) {
            is_valid = true
        }
    })

    cb(null, is_valid)
} 

// --------------------------------------------------------------------------------
function check_login_and_send(req, res, cb) {
    check_login(req, function(err, is_login) {
        if (err || !is_login) {
            return res.send({ok : 0, msg : "没有登录"})
        }
        cb()
    })
}
exports.check_login_and_send = check_login_and_send
// --------------------------------------------------------------------------------