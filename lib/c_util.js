exports.encrypt_by_aes = function(key, iv, plaintext) {
    var cipher  = crypto.createCipheriv("aes-128-cbc", key, iv)
    var crypted = cipher.update(plaintext, 'binary', 'base64')
    crypted    += cipher.final('base64')
    
    return crypted
}
//--------------------------------------------------------------------------------------------------------
exports.decipher_by_aes = function(key, iv, crypted) {
    var decipher  = crypto.createDecipheriv("aes-128-cbc", key, iv)
    var decrypted = decipher.update(crypted,'base64', 'base64')
    decrypted    += decipher.final('base64')
    
    return decrypted
}