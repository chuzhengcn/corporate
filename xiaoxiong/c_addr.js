var util        = require("util"),
    m_addr      = require("./m_addr"),
    weixin      = require("../lib/c_weixin"),
    my_open_id  = wexin.my_open_id,
    error_text  = "绑定地址出错，请重试";

// 回复我的地址响应 ------------------------------------------------------------------
function send_event_my_addr_response(req, res) {
    var user_open_id    = req.weixin_user_msg.FromUserName[0],
        reply_content   = "",
        content         = "",
        now             = Date.now(),
        template        =   '<xml>' +
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
            content = '您还没有绑定地址，请<a href="">绑定</a>';
        }

        content = "您的常用地址：" + doc.name + " " + doc.tel + " " + doc.area + " " + doc.detail +
                  "，<a href=''>编辑或修改</a>"; 

        reply_content = util.format(template, user_open_id, my_open_id, now, content)
        res.type('xml')
        res.send(reply_content)
    })

}
exports.send_event_my_addr_response = send_event_my_addr_response;