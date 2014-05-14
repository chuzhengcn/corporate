var util        = require("util"),
    lib_util    = require("../lib/util"),
    m_product   = require("./m_product").Product,
    weixin      = require("../lib/c_weixin"),
    my_open_id  = weixin.my_open_id;

exports.info = function (req, res) {
    var id = req.params.id,
        open_id = req.params.open_id;

    m_product.findById(id, function(err, doc) {
        res.render('xiaoxiong/product_info', {
            product : doc,
            open_id : open_id,
        })
    })
}