var util        = require("util"),
    moment      = require("moment"),
    lib_util    = require("../../lib/util"),
    login       = require('./c_login'),
    m_recipe    = require("../m_recipe").Recipe;

exports.index = function (req, res) {
    login.check_login_and_send(req, res, function() {
        var page = parseInt(req.query.page) || 1;
        m_recipe.find_by_page(page, function(err, docs, total_page, current_page) {
            if (err) {
                console.log(err)
            }

            res.render('xiaoxiong/admin/recipe', {
                recipe_list : docs,
                total_page : total_page,
                current_page : current_page,
            })  
        })
    })
}

exports.create_page = function(req, res) {
    login.check_login_and_send(req, res, function() {
        res.render('xiaoxiong/admin/create_recipe')
    })
}

exports.create = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var now = Date.now(),
            doc = {
                title : req.body.title,
                content : req.body.content,
                thumbnail: req.body.thumbnail_url,
                original_price: parseFloat(req.body.original_price) * 100,
                price: parseFloat(req.body.price) * 100,
                create_date : moment(now).format("YYYY-MM-DD"),
                create_at : now,
                modify_at : now,
            }

        m_recipe.create(doc, function(err) {
            res.send({ok : 1})
        })
    })
}

exports.info = function(req, res) {
    login.check_login_and_send(req, res, function() {
        m_recipe.findById(req.params.id, function(err, doc) {
            res.render('xiaoxiong/admin/recipe_info', {recipe : doc})
        })
    })
}

exports.edit_page = function(req, res) {
    login.check_login_and_send(req, res, function() {
        m_recipe.findById(req.params.id, function(err, doc) {
            res.render('xiaoxiong/admin/recipe_edit', {recipe : doc})
        })
    })
}

exports.edit = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var id = req.params.id,
            doc = {
                title : req.body.title,
                content : req.body.content,
                thumbnail: req.body.thumbnail_url,
                original_price: parseFloat(req.body.original_price) * 100,
                price: parseFloat(req.body.price) * 100,
                modify_at : Date.now(),
            };

        m_recipe.findByIdAndUpdate(id, doc, function(err) {
            if (err) {
                return res.send({ok : 0})
            }

            res.send({ok : 1})
        })
    })
}
