var index = require('./controller/index'),
    weixin = require('./controller/weixin');

function init_routes(app) {
    app.get('/', index.index);
    app.get('/create_weixin_menu', weixin.create_menu)
    app.get('/weixin', weixin.verify)
    app.post('/weixin', weixin.msg)
}

exports = module.exports = init_routes;