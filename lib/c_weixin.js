var TOKEN           = process.env.WEIXIN_TOKEN,
    my_open_id      = process.env.WEIXIN_OPEN_ID,
    AppId           = process.env.WEIXIN_APPID,
    AppSecret       = process.env.WEIXIN_APPSECRET,
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

exports.my_open_id = my_open_id;

exports.domain = "http://www.feiyesoft.com";

// --------------------------------------------------------------------------------------------------
var xiaoxiong_c_addr    = require('../xiaoxiong/c_addr'),
    xiaoxiong_c_order   = require('../xiaoxiong/c_order'),
    xiaoxiong_c_menu    = require('../xiaoxiong/c_menu');


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
                    "name" : "今日水果",
                    "key"  : "today_menu"
                },
                {
                    "type" : "click",
                    "name" : "我的订单",
                    "key"  : "my_order"
                },
                {
                    "type" : "click",
                    "name" : "收货地址",
                    "key"  : "my_addr",
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
        "event_today_menu" : xiaoxiong_c_menu.send_event_today_menu_response,
        "event_my_addr"    : xiaoxiong_c_addr.send_event_my_addr_response,
        "event_my_order"   : xiaoxiong_c_order.send_event_my_order_response,
        "default"          : send_default_response
    }

    if (msg_json.EventKey[0] && msg_json.EventKey[0] === 'today_menu') {
        return msg_type["event_today_menu"]
    }

    if (msg_json.EventKey[0] && msg_json.EventKey[0] === 'my_addr') {
        return msg_type["event_my_addr"]
    }

    if (msg_json.EventKey[0] && msg_json.EventKey[0] === 'my_order') {
        return msg_type["event_my_order"]
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
    var content = '亲，感谢您对小熊农场的支持，我们致力于将健康，精致带给每一个可爱的你，为了您可以享受最新鲜的食材，我们的配送方式是前一天下单，第二天早上配送给您，赶紧体验吧！猛击“下单”';

    var reply_content = util.format(template, req.weixin_user_msg.FromUserName[0], my_open_id, Date.now(), content)
    res.type('xml')
    res.send(reply_content)
}