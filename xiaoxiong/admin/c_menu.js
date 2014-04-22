var util        = require("util"),
    moment      = require("moment"),
    lib_util    = require("../../lib/util"),
    login       = require('./c_login'),
    m_menu      = require("../m_menu").Menu;

exports.index = function (req, res) {
    login.check_login_and_send(req, res, function() {
        var page = parseInt(req.query.page) || 1;
        m_menu.find_by_page(page, function(err, docs, total_page, current_page) {
            if (err) {
                console.log(err)
            }

            res.render('xiaoxiong/admin/menu', {
                menu_list : docs,
                total_page : total_page,
                current_page : current_page,
            })  
        })
    })
}

exports.create_page = function(req, res) {
    login.check_login_and_send(req, res, function() {
        res.render('xiaoxiong/admin/create_menu')
    })
}