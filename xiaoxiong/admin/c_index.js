var login = require("./c_login");

exports.index = function(req, res) {
    login.check_login_and_send(req, res, function() {
        res.render('xiaoxiong/admin/index')    
    })
}