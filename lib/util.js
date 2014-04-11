var crypto = require('crypto'),
    default_algorithm = 'aes-256-cbc',
    default_key = 'feiyesoft1984';
//--------------------------------------------------------------------------------------------------------
function encipher(text, key, algorithm) {
    algorithm = algorithm || default_algorithm
    key = key || default_key

    var cipher = crypto.createCipher(algorithm, key)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')

    return crypted
}
exports.encipher = encipher;

//--------------------------------------------------------------------------------------------------------
function decipher(crypted, key, algorithm) {
    algorithm = algorithm || default_algorithm
    key = key || default_key

    var decipher = crypto.createDecipher(algorithm, key)
    var text = decipher.update(crypted, 'hex', 'utf8')
    text += decipher.final('utf8')

    return text
}
exports.decipher = decipher;

