var index = require('./controller/index')

function init_routes(app) {
    app.get('/', index.index);
}

exports = module.exports = init_routes;