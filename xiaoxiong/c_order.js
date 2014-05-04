var util        = require("util"),
    lib_util    = require("../lib/util"),
    m_cart      = require("./m_cart").Cart,
    m_order     = require("./m_order").Order,
    m_recipe    = require("./m_recipe").Recipe;


exports.create = function (req, res) {
    var user_open_id = lib_util.decipher(req.params.open_id);

    m_order.create_order(user_open_id, function(err, docs) {
        if (err) {
            return res.send({ok : 0})
        }

        res.send({ok : 1})
    })
}

exports.list = function(req, res) {
    var user_open_id = lib_util.decipher(req.params.open_id),
        page         = req.query.page;

    m_order.user_list(user_open_id, page, function(err, docs) {
        res.render('xiaoxiong/order_list', {
            user_open_id : req.params.open_id,
            orders : docs
        })
    })
}