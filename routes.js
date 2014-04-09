var index                   = require('./controller/index'),
    weixin                  = require('./controller/weixin'),
    xiaoxiong_index         = require('./controller/xiaoxiong/index'),
    xiaoxiong_admin_index   = require('./controller/xiaoxiong/admin/index');
    xiaoxiong_admin_login   = require('./controller/xiaoxiong/admin/login');

function init_routes(app) {
    app.get('/', index.index);
    app.get('/create_weixin_menu', weixin.create_menu)
    app.get('/weixin', weixin.verify)
    app.post('/weixin', weixin.msg)

    // xiaoxiong
    app.get('/xiaoxiong', xiaoxiong_index.index)

    // xiaoxiong admin
    app.get('/xiaoxiong-admin', xiaoxiong_admin_index.index)
    app.get('/xiaoxiong-admin/login', xiaoxiong_admin_login.index)
    app.post('/xiaoxiong-admin/login', xiaoxiong_admin_login.login)
}

exports = module.exports = init_routes;