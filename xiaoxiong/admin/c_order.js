var util        = require("util"),
    lib_util    = require("../../lib/util"),
    moment      = require("moment"),
    m_order     = require("../m_order").Order,
    m_recipe    = require("../m_recipe").Recipe;

exports.list = function(req, res) {
    var page         = req.query.page;

    m_order.list(page, function(err, doc_orders, total, current_page) {
        doc_orders = doc_orders.map(function(item) {
            item.create_time = moment(item.create_at).format("YYYY-MM-DD HH:mm")
            return item
        })
        res.render('xiaoxiong/admin/order', {
            total_page : total,
            current_page : current_page,    
            orders : doc_orders,
        })
    })
}