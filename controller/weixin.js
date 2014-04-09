var TOKEN           = process.env.WEIXIN_TOKEN || 'feiyesoft1984',
    AppId           = "wx1df3c5de14d613e4",
    AppSecret       = "16169c56643a9838ed25b2179e734512",
    crypto          = require('crypto'),
    util            = require('util'),
    request         = require('request'),
    async           = require('async'),
    parseXmlString  = require('xml2js').parseString,
    access_token    = {
        access_token      : "",
        create_at         : 0,
        expires_in : 0
    };


// 获取access token ---------------------------------------------------------------------------------
function get_access_token(cb) {
    var now = Date.now();

    // 没有过期的情况下 不重复取token
    if (now - access_token.create_at < access_token.expires_in) {
        return cb(null, access_token.access_token)
    }

    var url = "https://api.weixin.qq.com/cgi-bin/token";

    request({
        url : url + '?grant_type=client_credential&appid=' + AppId + '&secret=' + AppSecret,
        json : {},
    }, function(err, response, body) {
        if (body.access_token) {
            access_token = body
            access_token.create_at = Date.now()

            return cb(null, access_token.access_token)
        }

        cb(body.errmsg)
    })
}

// 申请消息接口，成为开发者----------------------------------------------------------------------------------
function verify(req, res) {
    var echostr = req.query.echostr;

    if (is_valid_signature(req.query.signature, req.query.timestamp, req.query.nonce)) {
        res.send(echostr)
    } else {
        res.send({ok : 0, msg : '验证失败'})        
    }
}

exports.verify = verify

// 验证消息真实性--------------------------------------------------------------------------------
function is_valid_signature(signature, timestamp, nonce) {
    var shasum              = crypto.createHash('sha1'),
        unencrypted_params  = [TOKEN, timestamp, nonce].sort().join().replace(/,/g, ''),
        encrypted_str       = '';

    shasum.update(unencrypted_params)
    encrypted_str = shasum.digest('hex')

    if (encrypted_str === signature) {
        return true
    } else {
        return false
    }
}

exports.is_valid_signature = is_valid_signature

// 创建自定义菜单------------------------------------------------------------------------------------------------
function create_menu(req, res) {
    var create_url = "https://api.weixin.qq.com/cgi-bin/menu/create",
        menu_data = {
        "button" : [
            {   
                "type" : "click",
                "name" : "关于扉页",
                "key"  : "about_feiye"
            },
            {
                "type" : "click",
                "name" : "联系我们",
                "key"  : "contact_us"
            },
            {
                "name"       : "小熊农场",
                "sub_button" : [
                    { 
                      "type" : "click",
                      "name" : "今日菜谱",
                      "key"  : "today_menu"
                    }
                ]
            }
        ]
    };

    async.waterfall([
        get_access_token,

        function(token, callback) {
            request({
                url     : create_url + "?access_token=" + token,
                method  : "POST",
                json    : menu_data,
            }, function(err, response, body) {
                callback(err)
            })
        }
    ], function(err) {
        res.send({err : err})
    })
}

exports.create_menu = create_menu;

// 接收消息--------------------------------------------------------------------------------------------
function msg(req, res) {
    if (!(is_valid_signature(req.query.signature, req.query.timestamp, req.query.nonce))) {
        return res.send({ok : 0, msg : '消息不是来自于微信'}) 
    }

    var body = '';

    req.setEncoding('utf8');

    req.on('data', function(chunk) {
        body += chunk
    })

    req.on('end', function() {
        parseXmlString(body, function(err, results) {
            req.weixin_user_msg = results.xml
            send_response_msg(req, res)
        })
    })
}

exports.msg = msg;

// 发送被动响应消息------------------------------------------------------------------------------------------------
function send_response_msg(req, res) {
    response_in_different_way(req.weixin_user_msg)(req, res)
}

// 分析消息类型, 调用不同的函数---------------------------------------------------------------------------------------
function response_in_different_way(msg_json) {
    var msg_type = {
        "event_today_menu" : send_event_today_menu_response,
        "default"          : send_default_response
    }

    if (msg_json.EventKey && msg_json.EventKey === 'today_menu') {
        return msg_type["event_today_menu"]
    }

    return msg_type["default"]
}

// 用默认方式回复用户---------------------------------------------------------------------------------------
function send_default_response(req, res) {
    var template =  '<xml>' +
                        '<ToUserName><![CDATA[%s]]></ToUserName>' +
                        '<FromUserName><![CDATA[%s]]></FromUserName>' +
                        '<CreateTime>%d</CreateTime>' +
                        '<MsgType><![CDATA[text]]></MsgType>' +
                        '<Content><![CDATA[%s]]></Content>' + 
                    '</xml>';
    var content = '扉页软件公众账号正在开发中，谢谢关注！';

    var reply_content = util.format(template, req.weixin_user_msg.FromUserName, req.weixin_user_msg.ToUserName,
                                    Date.now(), content)
    res.type('xml')
    res.send(reply_content)
}
// 回复今日菜单 多图文-----------------------------------------------------------------------------------------------------
function send_event_today_menu_response(req, res) {
    var template =  '<xml>' +
                        '<ToUserName><![CDATA[%s]]></ToUserName>' +
                        '<FromUserName><![CDATA[%s]]></FromUserName>' +
                        '<CreateTime>%d</CreateTime>' +
                        '<MsgType><![CDATA[news]]></MsgType>' +
                        '<ArticleCount><![CDATA[%d]]></ArticleCount>' + 
                        '<Articles></Articles>'
                    '</xml>';
    var item_template = "<item>" +
                            "<Title><![CDATA[%s]]></Title>" + 
                            "<Description><![CDATA[%s]]></Description>" +
                            "<PicUrl><![CDATA[%s]]></PicUrl>" +
                            "<Url><![CDATA[%s]]></Url>" +
                        "</item>";

    var menu = [
        {
            "title" : "茄子炒肉",
            "description" : "茄子炒肉的做法",
            "pic_url" : "http://recipe0.hoto.cn/pic/recipe/l/02/70/159746_8ed537.jpg",
            "url" : "http://www.haodou.com/recipe/album/74068/"
        }
    ];

    var items = "";

    menu.forEach(function(item) {
        items += util.format(item_template, item.title, item.description, item.pic_url, item.url)
    })

    template = util.format(template, req.weixin_user_msg.FromUserName, req.weixin_user_msg.ToUserName,
                            Date.now(), menu.length);

    var insert_point = template.lastIndexOf('Articles') - 2

    var reply_content = template.slice(0, insert_point) + items + template.slice(insert_point)

    console.log(reply_content)
    res.type('xml')
    res.send(reply_content)
}
// -----------------------------------------------------------------------

