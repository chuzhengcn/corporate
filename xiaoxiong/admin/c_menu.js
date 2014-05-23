var util        = require("util"),
    moment      = require("moment"),
    lib_util    = require("../../lib/util"),
    login       = require('./c_login'),
    m_menu      = require("../m_menu").Menu,
    m_recipe    = require("../m_recipe").Recipe,
    m_product   = require("../m_product").Product;

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
        m_product.find_newest_by_create_at(20, function(err, create_docs) {
            m_product.find_newest_by_modify_at(20, function(err, modify_docs) {
                res.render('xiaoxiong/admin/menu_create', {
                    newest_products : create_docs,
                    modify_products : modify_docs
                })
            })
        })
    })
}

exports.create = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var now = Date.now(),
            doc = {
                title   : req.body.title,
                description : req.body.description,
                cover_img : req.body.cover_img,
                content : [].concat(req.body.top),    
                top     : [].concat(req.body.product),
                publish_date : req.body.publish_date,
                create_date : moment(now).format("YYYY-MM-DD"),
                create_at : now,
                modify_at : now,
            };

        m_menu.create(doc, function(err) {
            if (err) {
                console.log(err)
                res.send({ok : 0})
                return
            }

            res.send({ok : 1})
        })
    })
}

exports.info = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var id = req.params.id;

        m_menu.find_by_id_and_products(id, function(err, doc) {
            res.render('xiaoxiong/admin/menu_info', {
                menu : doc
            })
        })
    })
}

exports.edit_page = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var id = req.params.id;

        m_product.find_newest_by_create_at(20, function(err, create_docs) {
            m_product.find_newest_by_modify_at(20, function(err, modify_docs) {
                m_menu.find_by_id_and_products(id, function(err, doc) {
                    res.render('xiaoxiong/admin/menu_edit', {
                        menu : doc,
                        newest_products : create_docs,
                        modify_products : modify_docs
                    })
                })
            })
        })
    })
}

exports.edit = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var id = req.params.id,
            now = Date.now(),
            doc = {
                title   : req.body.title,
                top : [].concat(req.body.top),
                content : [].concat(req.body.product),
                description : req.body.description,
                cover_img : req.body.cover_img,
                publish_date : req.body.publish_date,
                modify_at : now,
            };

        m_menu.findByIdAndUpdate(id, doc, function(err) {
            if (err) {
                return res.send({ok : 0})
            }

            res.send({ok : 1})
        })
    })
}

exports.remove = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var id = req.params.id;
            
        m_menu.findByIdAndRemove(id, function(err) {
            if (err) {
                return res.send({ok : 0})
            }

            res.send({ok : 1})
        })
    })
}