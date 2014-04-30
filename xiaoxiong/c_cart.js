var util        = require("util"),
    m_cart      = require("./m_cart").Cart,
    m_addr      = require("./m_addr").Addr,
    lib_util    = require("../lib/util");

exports.index = function (req, res) {
    var user_open_id = lib_util.decipher(req.params.open_id);

    m_cart.find_cart_with_recipe_by_openid(user_open_id, function(err, docs) {
        res.send({ok : 1, cart : docs})
    })
}

exports.create = function(req, res) {
    var user_open_id = lib_util.decipher(req.params.open_id),
        doc = {
            user_open_id : user_open_id,
            recipe_id    : req.body.recipe_id,
        };

    m_cart.add_one_recipe(doc, function(err, doc) {
        if (err) {
            return res.send({ok : 0})
        }

        res.send({ok : 1})
    })
}

exports.page = function(req, res) {
    var user_open_id = lib_util.decipher(req.params.open_id);

    m_addr.find_last_used(user_open_id, function(err, addr_doc) {
        if (err) {
            console.log(err)
        }

        m_cart.find_cart_with_recipe_by_openid(user_open_id, function(err, doc) {
            res.render('xiaoxiong/cart', {
                user_open_id : req.params.open_id, 
                cart : doc,
                addr : addr_doc
            })
        })
    })
}

exports.remove_recipe = function(req, res) {
    var user_open_id = lib_util.decipher(req.params.open_id),
        recipe_id    = req.params.recipe_id;

    m_cart.findOneAndRemove({user_open_id : user_open_id, recipe_id : recipe_id}, function(err) {
        if (err) {
            return res.send({ok : 0})
        }

        res.send({ok : 1})
    })
}

