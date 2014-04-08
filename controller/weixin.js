var TOKEN   = process.env.WEIXIN_TOKEN || 'feiyesoft1984',
    crypto  = require('crypto');

// ------------------------------------------------------------------------------------------------
function verify(req, res) {
    var echostr = req.query.echostr,

    if (is_valid_signature(req.query.signature, req.query.timestamp, req.query.nonce)) {
        res.send(echostr)
    } else {
        res.send({ok : 0, msg : '验证失败'})        
    }
}

exports.verify = verify
// ------------------------------------------------------------------------------------------------
function is_valid_signature(signature, timestamp, nonce) {
    var shasum              = crypto.createHash('sha1'),
        unencrypted_params  = [timestamp, nonce].sort().join().replace(/,/g, ''),
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