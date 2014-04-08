var TOKEN           = process.env.WEIXIN_TOKEN || 'feiyesoft1984',
    crypto          = require('crypto'),
    util            = require('util'),
    parseXmlString  = require('xml2js').parseString;

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
// ------------------------------------------------------------------------------------------------
function msg(req, res) {
    if (!is_valid_signature(req.query.signature, req.query.timestamp, req.query.nonce)) {
        return res.send({ok : 0, msg : '消息不是来自于微信'}) 
    }

    var body = '';

    req.setEncoding('utf8');

    req.on('data', function(chunk) {
        body += chunk
    })

    req.on('end', function() {
        parseXmlString(body, function(err, results) {
            req.weixin_user_msg = results
            send_msg(req, res)
            res.type('xml')
            send_msg(req, res)
        })
    })
}

exports.msg = msg;
// ------------------------------------------------------------------------------------------------
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
exports.send_msg = send_msg
