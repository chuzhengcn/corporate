var feiye_index             = require('./feiye/c_index'),
    lib_weixin              = require('./lib/c_weixin'),
    xiaoxiong_index         = require('./xiaoxiong/c_index'),
    xiaoxiong_addr          = require('./xiaoxiong/c_addr'),
    xiaoxiong_admin_index   = require('./xiaoxiong/admin/c_index'),
    xiaoxiong_admin_login   = require('./xiaoxiong/admin/c_login');

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

    // xiaoxiong admin
    app.get('/xiaoxiong-admin', xiaoxiong_admin_index.index)
    app.get('/xiaoxiong-admin/login', xiaoxiong_admin_login.index)
    app.post('/xiaoxiong-admin/login', xiaoxiong_admin_login.login)
}

exports = module.exports = init_routes;