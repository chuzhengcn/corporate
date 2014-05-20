var util        = require("util"),
    m_cart      = require("./m_cart").Cart,
    m_addr      = require("./m_addr").Addr,
    lib_util    = require("../lib/util");

exports.index = function (req, res) {
    var open_id = req.params.open_id;

    m_cart.find_cart_with_product_by_openid(open_id, function(err, docs) {
        res.send({ok : 1, cart : docs})
    })
}

exports.create = function(req, res) {
    var open_id = req.params.open_id,
        doc = {
            open_id      : open_id,
            product_id   : req.body.product_id,
        };

    m_cart.add_one_product(doc, function(err, doc) {
        if (err) {
            return res.send({ok : 0})
        }

        res.send({ok : 1})
    })
}

exports.page = function(req, res) {
    var open_id = req.params.open_id;

    m_addr.find_last_used(open_id, function(err, addr_doc) {
        if (err) {
            return console.log(err)
        }

        m_cart.find_cart_with_product_by_openid(open_id, function(err, doc) {
            res.render('xiaoxiong/cart', {
                open_id : req.params.open_id, 
                cart : doc,
                addr : addr_doc
            })
        })
    })
}

exports.remove_product = function(req, res) {
    var open_id         = req.params.open_id,
        product_id      = req.params.product_id;

    m_cart.findOneAndRemove({open_id : open_id, product_id : product_id}, function(err) {
        if (err) {
            return res.send({ok : 0})
        }

        res.send({ok : 1})
    })
}

