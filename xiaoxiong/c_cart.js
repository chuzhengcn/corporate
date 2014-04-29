var util        = require("util"),
    m_cart      = require("./m_cart").Cart,
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

        console.log(err, doc)

        res.send({ok : 1})
    })
}