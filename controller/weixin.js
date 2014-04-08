var TOKEN   = process.env.WEIXIN_TOKEN || 'feiyesoft1984',
    crypto  = require('crypto');

// ------------------------------------------------------------------------------------------------
function verify(req, res) {
    var shasum              = crypto.createHash('sha1'),
        signature           = req.query.signature,
        echostr             = req.query.echostr,
        unencrypted_params  = [TOKEN, req.query.timestamp, req.query.nonce].sort().join().replace(/,/g, ''),
        encrypted_str       = '';

    shasum.update(unencrypted_params) 

    encrypted_str = shasum.digest('hex')

    if (encrypted_str === signature) {
        res.send(echostr)
    } else {
        res.send({ok : 0, msg : '验证失败'})        
    }
}

exports.verify = verify
// ------------------------------------------------------------------------------------------------