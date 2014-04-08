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

            res.type('xml')
            send_msg(req, res)
        })
    })
}

exports.msg = msg;

// 发送被动响应消息------------------------------------------------------------------------------------------------
function send_msg(req, res) {
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
    res.send(reply_content)

}

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
                "name"       : "项目",
                "sub_button" : [
                    { 
                      "type" : "view",
                      "name" : "小熊农场",
                      "url"  : "http://www.feiyesoft.com/xiaoxiong"
                    }
                ]
            },
            {
                "type" : "click",
                "name" : "联系我们",
                "key"  : "contact_us"
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

// -----------------------------------------------------------------------------------------------
