var util        = require("util"),
    lib_util    = require("../../lib/util"),
    moment      = require("moment"),
    login       = require('./c_login'),
    m_order     = require("../m_order"),
    Order       = m_order.Order,
    m_recipe    = require("../m_recipe").Recipe;

exports.list = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var page         = req.query.page;

        Order.list(page, function(err, doc_orders, total, current_page) {
            doc_orders = doc_orders.map(function(item) {
                item.create_time = moment(item.create_at).zone('+0800').format("YYYY-MM-DD HH:mm")
                return item
            })
            res.render('xiaoxiong/admin/order', {
                total_page : total,
                current_page : current_page,    
                orders : doc_orders,
            })
        })
    })
}

exports.info = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var id = req.params.id;

        Order.findById(id, function(err, doc) {
            doc.pay_name = m_order.pay_status[doc.pay.toString()]
            doc.status_name = m_order.order_status[doc.status.toString()]
            doc.create_time = moment(doc.create_at).zone('+0800').format("YYYY-MM-DD HH:mm:ss") 

            res.render('xiaoxiong/admin/order_info', {
                order : doc
            })
        })
    })
}

exports.edit = function (req, res) {
    login.check_login_and_send(req, res, function() {
        var id = req.params.id,
            arg = req.body;

        Order.update_status_by_id(id, arg, function(err, doc) {
            if (err) {
                return res.send({ok : 0, msg : JSON.stringify(err)})
            }

            res.send({ok : 1})
        })
    })
}







