var util            = require("util"),
    moment          = require("moment"),
    login           = require('./c_login'),
    m_product_type  = require("../m_product_type").ProductType;

exports.top_list = function (req, res) {
    login.check_login_and_send(req, res, function() {
        m_product_type.find_top_level(function(err, docs) {
            if (err) {
                console.log(err)
            }

            res.render('xiaoxiong/admin/product_type', {
                product_types : docs,
            })  
        })
    })
}

exports.create = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var now = Date.now(),
            doc = {
                title : req.body.title,
                create_date : moment(now).format("YYYY-MM-DD"),
                create_at : now,
                modify_at : now,
            };

        if (req.body.parent_type) {
            doc.parent_type = req.body.parent_type
        }

        m_product_type.create(doc, function(err) {
            if (err) {
                return res.send({ok : 0})
            }

            res.send({ok : 1})
        })
    })
}

exports.info = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var id = req.params.id;

        m_product_type.find_self_and_children(id, function(err, result) {
            if (err) {
                return console.log(err)
            }

            res.render('xiaoxiong/admin/product_type', {
                cur_type : result.cur_type,
                parents : result.parents,
                product_types : result.children,
            })
        })
    })
}

exports.edit = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var id = req.params.id;

        var now = Date.now(),
            doc = {
                title : req.body.title,
                modify_at : now,
            };

        m_product_type.findByIdAndUpdate(id, doc, function(err) {
            if (err) {
                return res.send({ok : 0})
            }

            res.send({ok : 1})
        })
    })
}