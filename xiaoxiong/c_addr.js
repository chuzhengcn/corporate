var util        = require("util"),
    lib_util    = require("../lib/util"),
    m_addr      = require("./m_addr").Addr,
    weixin      = require("../lib/c_weixin"),
    my_open_id  = weixin.my_open_id,
    error_text  = "绑定地址出错，请重试";

// 回复我的地址响应 ------------------------------------------------------------------
function send_event_my_addr_response(req, res) {
    var user_open_id            = req.weixin_user_msg.FromUserName[0],
        encypted_user_open_id   = lib_util.encipher(user_open_id),
        reply_content           = "",
        content                 = "",
        now                     = Date.now(),
        create_addr_url         = "/xiaoxiong/addr-create-page/" + encypted_user_open_id,
        all_addr_page           = "/xiaoxiong/addr/" + encypted_user_open_id,
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
            content = '您还没有收货地址。\n<a href="' + create_addr_url + '">现在添加</a>';
        } else {
            content = "您的常用地址：" + doc.name + " " + doc.tel + " " + doc.area + " " + doc.detail +
                      "，<a href='" + all_addr_page + "'>编辑或修改</a>"; 
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
    res.render('xiaoxiong/addr_list', {user_open_id : req.params.open_id})
}
exports.list_page = list_page