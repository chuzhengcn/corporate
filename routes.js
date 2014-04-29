var feiye_index             = require('./feiye/c_index'),
    lib_weixin              = require('./lib/c_weixin'),
    xiaoxiong_index         = require('./xiaoxiong/c_index'),
    xiaoxiong_addr          = require('./xiaoxiong/c_addr'),
    xiaoxiong_recipe        = require('./xiaoxiong/c_recipe'),
    xiaoxiong_menu          = require('./xiaoxiong/c_menu'),
    xiaoxiong_cart          = require('./xiaoxiong/c_cart'),
    xiaoxiong_admin_index   = require('./xiaoxiong/admin/c_index'),
    xiaoxiong_admin_upload  = require('./xiaoxiong/admin/c_upload'),
    xiaoxiong_admin_login   = require('./xiaoxiong/admin/c_login'),
    xiaoxiong_admin_recipe  = require('./xiaoxiong/admin/c_recipe'),
    xiaoxiong_admin_menu    = require('./xiaoxiong/admin/c_menu');

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

    app.get('/xiaoxiong/menus-today/user/:open_id', xiaoxiong_menu.today_menu)

    app.get('/xiaoxiong/recipes/:id/user/:open_id', xiaoxiong_recipe.info)

    app.get('/xiaoxiong/cart/:open_id', xiaoxiong_cart.index)
    app.post('/xiaoxiong/cart/:open_id', xiaoxiong_cart.create)


    // xiaoxiong admin
    app.post('/xiaoxiong-admin/upload/thumbnail', xiaoxiong_admin_upload.thumbnail)
    app.post('/xiaoxiong-admin/upload/editor', xiaoxiong_admin_upload.editor)
    app.get('/xiaoxiong-admin', xiaoxiong_admin_index.index)
    app.get('/xiaoxiong-admin/login', xiaoxiong_admin_login.index)
    app.post('/xiaoxiong-admin/login', xiaoxiong_admin_login.login)

    app.get('/xiaoxiong-admin/recipes', xiaoxiong_admin_recipe.index)
    app.get('/xiaoxiong-admin/recipes-create', xiaoxiong_admin_recipe.create_page)
    app.post('/xiaoxiong-admin/recipes', xiaoxiong_admin_recipe.create)
    app.get('/xiaoxiong-admin/recipes/:id', xiaoxiong_admin_recipe.info)
    app.get('/xiaoxiong-admin/recipes-edit/:id', xiaoxiong_admin_recipe.edit_page)
    app.put('/xiaoxiong-admin/recipes/:id', xiaoxiong_admin_recipe.edit)

    app.get('/xiaoxiong-admin/menus', xiaoxiong_admin_menu.index)
    app.get('/xiaoxiong-admin/menus-create', xiaoxiong_admin_menu.create_page)
    app.post('/xiaoxiong-admin/menus', xiaoxiong_admin_menu.create)
    app.get('/xiaoxiong-admin/menus/:id', xiaoxiong_admin_menu.info)
    app.get('/xiaoxiong-admin/menus-edit/:id', xiaoxiong_admin_menu.edit_page)
    app.put('/xiaoxiong-admin/menus/:id', xiaoxiong_admin_menu.edit)
}

exports = module.exports = init_routes;