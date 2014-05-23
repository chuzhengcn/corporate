var feiye_index                     = require('./feiye/c_index'),
    lib_weixin                      = require('./lib/c_weixin'),
    xiaoxiong_index                 = require('./xiaoxiong/c_index'),
    xiaoxiong_addr                  = require('./xiaoxiong/c_addr'),
    xiaoxiong_recipe                = require('./xiaoxiong/c_recipe'),
    xiaoxiong_product               = require('./xiaoxiong/c_product'),
    xiaoxiong_menu                  = require('./xiaoxiong/c_menu'),
    xiaoxiong_cart                  = require('./xiaoxiong/c_cart'),
    xiaoxiong_order                 = require('./xiaoxiong/c_order'),


    xiaoxiong_admin_product         = require('./xiaoxiong/admin/c_product'),
    xiaoxiong_admin_product_type    = require('./xiaoxiong/admin/c_product_type'),
    xiaoxiong_admin_index           = require('./xiaoxiong/admin/c_index'),
    xiaoxiong_admin_upload          = require('./xiaoxiong/admin/c_upload'),
    xiaoxiong_admin_login           = require('./xiaoxiong/admin/c_login'),
    xiaoxiong_admin_menu            = require('./xiaoxiong/admin/c_menu'),
    xiaoxiong_admin_order           = require('./xiaoxiong/admin/c_order');

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

    app.get('/xiaoxiong/products/:id/user/:open_id', xiaoxiong_product.info)

    app.get('/xiaoxiong/cart/:open_id', xiaoxiong_cart.index)
    app.post('/xiaoxiong/cart/:open_id', xiaoxiong_cart.create)
    app.get('/xiaoxiong/cart-page/:open_id', xiaoxiong_cart.page)
    app.delete('/xiaoxiong/cart/:product_id/user/:open_id', xiaoxiong_cart.remove_product)

    app.post('/xiaoxiong/orders/user/:open_id', xiaoxiong_order.create)
    app.get('/xiaoxiong/orders/user/:open_id', xiaoxiong_order.list)


    // xiaoxiong admin
    app.post('/xiaoxiong-admin/upload/thumbnail', xiaoxiong_admin_upload.thumbnail)
    app.post('/xiaoxiong-admin/upload/cover', xiaoxiong_admin_upload.cover)
    app.post('/xiaoxiong-admin/upload/editor', xiaoxiong_admin_upload.editor)
    app.get('/xiaoxiong-admin', xiaoxiong_admin_index.index)
    app.get('/xiaoxiong-admin/login', xiaoxiong_admin_login.index)
    app.post('/xiaoxiong-admin/login', xiaoxiong_admin_login.login)

    app.get('/xiaoxiong-admin/products', xiaoxiong_admin_product.index)
    app.get('/xiaoxiong-admin/products-create', xiaoxiong_admin_product.create_page)
    app.post('/xiaoxiong-admin/products', xiaoxiong_admin_product.create)
    app.get('/xiaoxiong-admin/products/:id', xiaoxiong_admin_product.info)
    app.get('/xiaoxiong-admin/products-edit/:id', xiaoxiong_admin_product.edit_page)
    app.put('/xiaoxiong-admin/products/:id', xiaoxiong_admin_product.edit)
    app.delete('/xiaoxiong-admin/products/:id', xiaoxiong_admin_product.remove)

    app.get('/xiaoxiong-admin/menus', xiaoxiong_admin_menu.index)
    app.get('/xiaoxiong-admin/menus-create', xiaoxiong_admin_menu.create_page)
    app.post('/xiaoxiong-admin/menus', xiaoxiong_admin_menu.create)
    app.get('/xiaoxiong-admin/menus/:id', xiaoxiong_admin_menu.info)
    app.get('/xiaoxiong-admin/menus-edit/:id', xiaoxiong_admin_menu.edit_page)
    app.put('/xiaoxiong-admin/menus/:id', xiaoxiong_admin_menu.edit)
    app.delete('/xiaoxiong-admin/menus/:id', xiaoxiong_admin_menu.remove)

    app.get('/xiaoxiong-admin/orders', xiaoxiong_admin_order.list)
    app.get('/xiaoxiong-admin/orders/:id', xiaoxiong_admin_order.info)
    app.put('/xiaoxiong-admin/orders/:id', xiaoxiong_admin_order.edit)

    app.get('/xiaoxiong-admin/product-types', xiaoxiong_admin_product_type.top_list)
    app.post('/xiaoxiong-admin/product-types', xiaoxiong_admin_product_type.create)
    app.get('/xiaoxiong-admin/product-types/:id', xiaoxiong_admin_product_type.info)
    app.put('/xiaoxiong-admin/product-types/:id', xiaoxiong_admin_product_type.edit)
    app.delete('/xiaoxiong-admin/product-types/:id', xiaoxiong_admin_product_type.remove)
    app.get('/xiaoxiong-admin/products-types-children/:id', xiaoxiong_admin_product_type.children)
}

exports = module.exports = init_routes;