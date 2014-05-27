var util                = require("util"),
    moment              = require("moment"),
    lib_util            = require("../../lib/util"),
    login               = require('./c_login'),
    m_product           = require("../m_product").Product,
    m_product_type      = require("../m_product_type").ProductType,
    unit_config         = require("../m_product").unit_config;

exports.index = function (req, res) {
    login.check_login_and_send(req, res, function() {
        var page = parseInt(req.query.page) || 1;
        m_product.find_by_page(page, function(err, docs, total_page, current_page) {
            if (err) {
                console.log(err)
            }

            res.render('xiaoxiong/admin/product', {
                product_list : docs,
                total_page : total_page,
                current_page : current_page,
            })  
        })
    })
}

exports.create_page = function(req, res) {
    login.check_login_and_send(req, res, function() {
        m_product_type.find_top_level(function(err, docs) {
            res.render('xiaoxiong/admin/create_product', {
                top_type_list : docs,
                unit_config   : unit_config,
            })
        })
    })
}

exports.create = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var now = Date.now(),
            doc = {
                title           : req.body.title,
                content         : req.body.content,
                thumbnail       : req.body.thumbnail_url || "/xiaoxiong/img/blank-product.jpg",
                unit            : req.body.unit,
                original_price  : parseFloat(req.body.original_price) * 100,
                price           : parseFloat(req.body.price) * 100,
                create_date     : moment(now).format("YYYY-MM-DD"),
                create_at       : now,
                modify_at       : now,
            }

        if (Array.isArray(req.body.type)) {
            doc.type = req.body.type.slice(-1)
        } else {
            doc.type = req.body.type
        }

        m_product.create(doc, function(err) {
            res.send({ok : 1})
        })
    })
}

exports.info = function(req, res) {
    login.check_login_and_send(req, res, function() {
        m_product.findById(req.params.id, function(err, doc) {
            m_product_type.find_type_bread(doc.type, function(err, type_docs) {
                res.render('xiaoxiong/admin/product_info', {
                    product : doc,
                    types   : type_docs,
                }) 
            })
        })
    })
}

exports.edit_page = function(req, res) {
    login.check_login_and_send(req, res, function() {
        m_product.findById(req.params.id, function(err, doc) {
            m_product_type.find_type_bread(doc.type, function(err, type_docs) {
                m_product_type.find_top_level(function(err, top_type_docs) {
                    res.render('xiaoxiong/admin/product_edit', {
                        product : doc,
                        types   : type_docs,
                        top_type_list : top_type_docs,
                        unit_config : unit_config,
                    }) 
                })
            })
        })
    })
}

exports.edit = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var id = req.params.id,
            doc = {
                title           : req.body.title,
                content         : req.body.content,
                unit            : req.body.unit,
                thumbnail       : req.body.thumbnail_url,
                original_price  : parseFloat(req.body.original_price) * 100,
                price           : parseFloat(req.body.price) * 100,
                modify_at       : Date.now(),
            };

        var type = req.body.type;

        if (Array.isArray(type)) {
            doc.type = type.slice(-1)
        }

        if (typeof type === 'string' && type !== 'blank') {
            doc.type = type
        }

        m_product.findByIdAndUpdate(id, doc, function(err) {
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

        m_product.findByIdAndUpdate(id, {remove : "yes"}, function(err) {
            if (err) {
                return res.send({ok : 0})
            }

            res.send({ok : 1})
        })
    })
}