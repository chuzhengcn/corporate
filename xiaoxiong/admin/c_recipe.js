var util        = require("util"),
    lib_util    = require("../../lib/util"),
    m_recipe      = require("../m_recipe").Recipe;


exports.index = function (req, res) {
    var page = parseInt(req.query.page) || 1;
    m_recipe.find_by_page(page, function(err, docs) {
        if (err) {
            console.log(err)
        }

        res.render('xiaoxiong/admin/recipe', {recipe_list : docs})  
    })
}

exports.create_page = function(req, res) {
    res.render('xiaoxiong/admin/create_recipe')
}

exports.create = function(req, res) {
    var doc = {
        title : req.body.title,
        content : req.body.content,
        thumbnail: req.body.thumbnail,
        original_price: req.body.original_price,
        price: req.body.price,
        create_at : Date.now()
    }

    m_recipe.create()
}
