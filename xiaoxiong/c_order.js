var weixin      = require("../lib/c_weixin"),
    my_open_id  = weixin.my_open_id,
    domain      = weixin.domain,
    util        = require("util"),
    lib_util    = require("../lib/util"),
    m_cart      = require("./m_cart").Cart,
    m_order     = require("./m_order").Order,
    m_recipe    = require("./m_recipe").Recipe;


exports.send_event_my_order_response = function(req, res) {
    var open_id                 = req.weixin_user_msg.FromUserName[0],
        reply_content           = "",
        content                 = "",
        error_text              = "获取订单出错，请重试",
        now                     = Date.now(),
        all_user_order_page     = domain + "/xiaoxiong/orders/user/" + open_id,
        template                = '<xml>' +
                                    '<ToUserName><![CDATA[%s]]></ToUserName>' +
                                    '<FromUserName><![CDATA[%s]]></FromUserName>' +
                                    '<CreateTime>%d</CreateTime>' +
                                    '<MsgType><![CDATA[text]]></MsgType>' +
                                    '<Content><![CDATA[%s]]></Content>' + 
                                  '</xml>';

    m_order.find_user_lasted_order(open_id, function(err, doc) {
        if (err) {
            content = error_text
            console.log(err)
        }

        if (!doc) {
            content = '您还没有订单。';
        } else {
            var products ="";
            doc.products.forEach(function(item) {
                products += item.title + " "
            })

            content = "您的最近一次订单：[" + doc.create_date +"] " + recipes + ", 总价： " + (doc.price/100).toFixed(2) + "元。\n" +
                      "<a href='" + all_user_order_page + "'>全部订单</a>"; 
        }

        reply_content = util.format(template, open_id, my_open_id, now, content)
        res.type('xml')
        res.send(reply_content)
    })
}

exports.create = function (req, res) {
    var open_id = req.params.open_id;

    m_order.create_order(open_id, function(err, docs) {
        if (err) {
            return res.send({ok : 0})
        }

        res.send({ok : 1})
    })
}

exports.list = function(req, res) {
    var open_id = req.params.open_id,
        page    = req.query.page;

    m_order.user_list(open_id, page, function(err, docs) {
        res.render('xiaoxiong/order_list', {
            open_id : req.params.open_id,
            orders : docs
        })
    })
}