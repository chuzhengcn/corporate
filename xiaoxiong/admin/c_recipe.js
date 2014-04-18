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

