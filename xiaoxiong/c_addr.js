var util        = require("util"),
    lib_util    = require("../lib/util"),
    m_addr      = require("./m_addr").Addr,
    weixin      = require("../lib/c_weixin"),
    my_open_id  = weixin.my_open_id,
    domain      = "http://www.feiyesoft.com"
    error_text  = "绑定地址出错，请重试";

// 回复我的地址响应 ------------------------------------------------------------------
function send_event_my_addr_response(req, res) {
    var user_open_id            = req.weixin_user_msg.FromUserName[0],
        encypted_user_open_id   = lib_util.encipher(user_open_id),
        reply_content           = "",
        content                 = "",
        now                     = Date.now(),
        create_addr_url         = domain + "/xiaoxiong/addr-create-page/" + encypted_user_open_id,
        all_addr_page           = domain + "/xiaoxiong/addr/" + encypted_user_open_id,
        template                = '<xml>' +
                                    '<ToUserName><![CDATA[%s]]></ToUserName>' +
                                    '<FromUserName><![CDATA[%s]]></FromUserName>' +
                                    '<CreateTime>%d</CreateTime>' +
                                    '<MsgType><![CDATA[text]]></MsgType>' +
                                    '<Content><![CDATA[%s]]></Content>' + 
                                  '</xml>';



    m_addr.find_last_used(user_open_id, function(err, doc) {
        if (err) {
            content = error_text
            console.log(err)
        }

        if (!doc) {
            content = '您还没有收货地址。<a href="' + create_addr_url + '">现在添加</a>';
            console.log(content)
        } else {
            content = "您的常用地址：" + doc.name + " " + doc.tel + " " + doc.area + " " + doc.detail +
                      "。<a href='" + all_addr_page + "'>修改</a>"; 
        }

        reply_content = util.format(template, user_open_id, my_open_id, now, content)
        res.type('xml')
        res.send(reply_content)
    })

}
exports.send_event_my_addr_response = send_event_my_addr_response;

function create_page(req, res) {
    res.render('xiaoxiong/create_addr', {user_open_id : req.params.open_id})
}
exports.create_page = create_page

function list_page(req, res) {
    var open_id = lib_util.decipher(req.params.open_id);

    m_addr.find({open_id : open_id}).sort("-last_used_at").exec(function(err, results) {

        res.render('xiaoxiong/addr_list', 
            {
                user_open_id : req.params.open_id,
                addr_list    : results
            }
        )
    })
}
exports.list_page = list_page

function create(req, res) {
    var doc = {
        open_id         : lib_util.decipher(req.body.user_open_id),
        name            : req.body.name,
        tel             : req.body.tel,
        area            : req.body.area,
        detail          : req.body.detail,
        postcode        : 518000,
        last_used_at    : Date.now()
    }

    m_addr.create(doc, function(err) {
        if (err) {
            return res.send({ok : 0})
        }

        res.send({ok : 1})
    })
}
exports.create = create;