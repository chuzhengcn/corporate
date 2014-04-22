var fs              = require('fs');

exports.index = function(req, res) {
    var input_file_name = "thumbnail",
        max_size        = 5000000,
        local_path      = __dirname + '/../../public/xiaoxiong/_att',
        upload_file     = req.files[input_file_name],
        http_url        = "http://www.feiyesoft.com/xiaoxiong/_att";

    if (upload_file.size > max_size) {
        fs.unlink(upload_file.path)
        return res.send({ok : 0})
    }

    var changed_file_name = upload_file.path.slice(upload_file.path.lastIndexOf('/')).toLocaleLowerCase();

    fs.rename(upload_file.path, local_path + changed_file_name, function() {
        res.send({ ok : 1, url : http_url + changed_file_name })
    })
}