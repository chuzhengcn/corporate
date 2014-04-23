var util        = require("util"),
    lib_util    = require("../lib/util"),
    m_recipe    = require("./m_recipe").Recipe,
    weixin      = require("../lib/c_weixin"),
    my_open_id  = weixin.my_open_id,
    domain      = "http://www.feiyesoft.com";

exports.info = function (req, res) {
    var id = req.params.id,
        user_open_id = req.params.open_id;

    m_recipe.findById(id, function(err, doc) {
        res.render('xiaoxiong/recipe_info', {
            recipe : doc,
            user_open_id : user_open_id,
        })
    })
}