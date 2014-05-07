var util        = require("util"),
    lib_util    = require("../lib/util"),
    m_addr      = require("./m_addr").Addr,
    weixin      = require("../lib/c_weixin"),
    my_open_id  = weixin.my_open_id,
    domain      = weixin.domain,
    error_text  = "绑定地址出错，请重试";

// 回复我的地址响应 ------------------------------------------------------------------
function send_event_my_addr_response(req, res) {
    console.log('ddd')
    var open_id                 = req.weixin_user_msg.FromUserName[0],
        reply_content           = "",
        content                 = "",
        now                     = Date.now(),
        create_addr_url         = domain + "/xiaoxiong/addr-create-page/" + open_id,
        all_addr_page           = domain + "/xiaoxiong/addr/" + open_id,
        template                = '<xml>' +
                                    '<ToUserName><![CDATA[%s]]></ToUserName>' +
                                    '<FromUserName><![CDATA[%s]]></FromUserName>' +
                                    '<CreateTime>%d</CreateTime>' +
                                    '<MsgType><![CDATA[text]]></MsgType>' +
                                    '<Content><![CDATA[%s\n%s]]></Content>' + 
                                  '</xml>';



    m_addr.find_last_used(open_id, function(err, doc) {
        if (err) {
            content = error_text
            console.log(err)
        }

        if (!doc) {
            content = '您还没有收货地址。<a href="' + create_addr_url + '">现在添加</a>';
        } else {
            content = "您的常用地址：" + doc.name + " " + doc.tel + " " + doc.area + " " + doc.detail +
                      "。<a href='" + all_addr_page + "'>修改</a>"; 
        }

        reply_content = util.format(template, open_id, my_open_id, now, content, 'hahah')
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

function edit_page(req, res) {
    var addr_id = req.params.addr_id;

    m_addr.findById(addr_id).exec(function(err, result) {
        res.render('xiaoxiong/edit_addr', {
            user_open_id : req.params.open_id,
            addr         : result,
        })
    })
}
exports.edit_page = edit_page

function edit(req, res) {
    var addr_id = req.params.addr_id,
        doc = {
            name            : req.body.name,
            tel             : req.body.tel,
            area            : req.body.area,
            detail          : req.body.detail,
            last_used_at    : Date.now()
        };
        
    for (var key in doc) {
        if (typeof doc[key] === 'undefined') {
            delete doc[key]
        }
    }

    m_addr.findByIdAndUpdate(addr_id, doc, function(err) {
        if (err) {
            console.log(err)
            return res.send({ok : 0})
        }

        res.send({ok : 1})
    })
}

exports.edit = edit;

function remove(req, res) {
    var addr_id = req.params.addr_id;

    m_addr.findByIdAndRemove(addr_id, function(err) {
        if (err) {
            return res.send({ok : 0})
        }

        res.send({ok : 1})
    })
}
exports.remove = remove;