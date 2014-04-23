var util        = require("util"),
    moment      = require("moment"),
    lib_util    = require("../../lib/util"),
    login       = require('./c_login'),
    m_menu      = require("../m_menu").Menu,
    m_recipe    = require("../m_recipe").Recipe;

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
        m_recipe.find_newest_by_create_at(20, function(err, create_docs) {
            m_recipe.find_newest_by_modify_at(20, function(err, modify_docs) {
                res.render('xiaoxiong/admin/menu_create', {
                    newest_recipes : create_docs,
                    modify_recipes : modify_docs
                })
            })
        })
    })
}