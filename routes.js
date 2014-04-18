var feiye_index             = require('./feiye/c_index'),
    lib_weixin              = require('./lib/c_weixin'),
    xiaoxiong_index         = require('./xiaoxiong/c_index'),
    xiaoxiong_addr          = require('./xiaoxiong/c_addr'),
    xiaoxiong_admin_index   = require('./xiaoxiong/admin/c_index'),
    xiaoxiong_admin_login   = require('./xiaoxiong/admin/c_login'),
    xiaoxiong_admin_recipe  = require('./xiaoxiong/admin/c_recipe');

function init_routes(app) {
    app.get('/', feiye_index.index);
    app.get('/create_weixin_menu', lib_weixin.create_menu)
    app.get('/weixin', lib_weixin.verify)
    app.post('/weixin', lib_weixin.msg)

    // xiaoxiong
    app.get('/xiaoxiong',           xiaoxiong_index.index)
    app.get('/xiaoxiong/addr-create-page/:open_id', xiaoxiong_addr.create_page)
    app.get('/xiaoxiong/addr/:open_id', xiaoxiong_addr.list_page)
    app.post('/xiaoxiong/addr', xiaoxiong_addr.create)
    app.get('/xiaoxiong/addr/:addr_id/user/:open_id', xiaoxiong_addr.edit_page)
    app.put('/xiaoxiong/addr/:addr_id/user/:open_id', xiaoxiong_addr.edit)
    app.delete('/xiaoxiong/addr/:addr_id/user/:open_id', xiaoxiong_addr.remove)

    // xiaoxiong admin
    app.get('/xiaoxiong-admin', xiaoxiong_admin_index.index)
    app.get('/xiaoxiong-admin/login', xiaoxiong_admin_login.index)
    app.post('/xiaoxiong-admin/login', xiaoxiong_admin_login.login)

    app.get('/xiaoxiong-admin/recipes', xiaoxiong_admin_recipe.index)
    app.get('/xiaoxiong-admin/recipes-create', xiaoxiong_admin_recipe.create_page)
    app.post('/xiaoxiong-admin/recipes', xiaoxiong_admin_recipe.create)
}

exports = module.exports = init_routes;