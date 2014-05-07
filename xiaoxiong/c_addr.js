var util        = require("util"),
    lib_util    = require("../lib/util"),
    m_addr      = require("./m_addr").Addr,
    weixin      = require("../lib/c_weixin"),
    my_open_id  = weixin.my_open_id,
    domain      = weixin.domain,
    error_text  = "绑定地址出错，请重试";

// 回复我的地址响应 ------------------------------------------------------------------
exports.send_event_my_addr_response = function (req, res) {
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
                                    '<Content><![CDATA[%s]]></Content>' + 
                                  '</xml>';



    m_addr.find_last_used(open_id, function(err, doc) {
        if (err) {
            content = error_text
            console.log(err)
        }

        if (!doc) {
            content = '您还没有收货地址。\t\r<a href="' + create_addr_url + '">现在添加</a>';
        } else {
            content = "您的常用地址：\t\r" + 
                        doc.userName + " " + doc.telNumber + "\t\r" +
                        doc.addressCitySecondStageName + doc.addressCountiesThirdStageName + " " + 
                        doc.addressDetailInfo + "\t\r<a href='" + all_addr_page + "'>修改</a>";
        }

        reply_content = util.format(template, open_id, my_open_id, now, content)
        res.type('xml')
        res.send(reply_content)
    })

}


exports.create_page = function(req, res) {
    res.render('xiaoxiong/create_addr', {open_id : req.params.open_id})
}

exports.list_page = function(req, res) {
    var open_id = req.params.open_id;

    m_addr.find({open_id : open_id}).sort("-last_used_at").exec(function(err, results) {

        res.render('xiaoxiong/addr_list', 
            {
                open_id   : req.params.open_id,
                addr_list : results
            }
        )
    })
}

exports.create = function(req, res) {
    var doc = {
        open_id                         : req.body.open_id,
        userName                        : req.body.userName,
        telNumber                       : req.body.telNumber,
        addressCountiesThirdStageName   : req.body.addressCountiesThirdStageName,
        addressDetailInfo               : req.body.addressDetailInfo,
        last_used_at                    : Date.now(),
        created_at                      : Date.now(),
    }

    m_addr.create(doc, function(err) {
        if (err) {
            return res.send({ok : 0})
        }

        res.send({ok : 1})
    })
}

exports.edit_page = function(req, res) {
    var addr_id = req.params.addr_id;

    m_addr.findById(addr_id).exec(function(err, result) {
        res.render('xiaoxiong/edit_addr', {
            open_id : req.params.open_id,
            addr    : result,
        })
    })
}

exports.edit = function (req, res) {
    var addr_id = req.params.addr_id,
        doc = {
            userName                        : req.body.userName,
            telNumber                       : req.body.telNumber,
            addressCountiesThirdStageName   : req.body.addressCountiesThirdStageName,
            addressDetailInfo               : req.body.addressDetailInfo,
            last_used_at                    : Date.now()
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

exports.remove = function(req, res) {
    var addr_id = req.params.addr_id;

    m_addr.findByIdAndRemove(addr_id, function(err) {
        if (err) {
            return res.send({ok : 0})
        }

        res.send({ok : 1})
    })
}