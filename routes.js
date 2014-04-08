var index = require('./controller/index'),
    weixin = require('./controller/weixin');

function init_routes(app) {
    app.get('/', index.index);
    app.get('/weixin/verify', weixin.verify)
}

exports = module.exports = init_routes;