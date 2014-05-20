var fs              = require('fs'),
    login           = require('./c_login')
    max_size        = 2000000;

exports.thumbnail = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var input_file_name = "thumbnail",
            local_path      = __dirname + '/../../public/xiaoxiong/_att/' + input_file_name,
            upload_file     = req.files[input_file_name],
            http_url        = "http://www.feiyesoft.com/xiaoxiong/_att/" + input_file_name;

        if (upload_file.size > max_size) {
            fs.unlink(upload_file.path)
            return res.send({ok : 0})
        }

        var changed_file_name = upload_file.path.slice(upload_file.path.lastIndexOf('/')).toLocaleLowerCase();

        fs.rename(upload_file.path, local_path + changed_file_name, function() {
            res.send({ ok : 1, url : http_url + changed_file_name })
        })
    })
}

exports.cover = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var input_file_name = "cover",
            local_path      = __dirname + '/../../public/xiaoxiong/_att/' + input_file_name,
            upload_file     = req.files[input_file_name],
            http_url        = "http://www.feiyesoft.com/xiaoxiong/_att/" + input_file_name;

        if (upload_file.size > max_size) {
            fs.unlink(upload_file.path)
            return res.send({ok : 0})
        }

        var changed_file_name = upload_file.path.slice(upload_file.path.lastIndexOf('/')).toLocaleLowerCase();

        fs.rename(upload_file.path, local_path + changed_file_name, function() {
            res.send({ ok : 1, url : http_url + changed_file_name })
        })
    })
}


exports.editor = function(req, res) {
    login.check_login_and_send(req, res, function() {
        var input_file_name = "imgFile",
            local_path      = __dirname + '/../../public/xiaoxiong/_att/editor',
            upload_file     = req.files[input_file_name],
            http_url        = "http://www.feiyesoft.com/xiaoxiong/_att/editor";

        if (upload_file.size > max_size) {
            fs.unlink(upload_file.path)
            return res.send({error : 1, message : "文件不能大于2m"})
        }

        var changed_file_name = upload_file.path.slice(upload_file.path.lastIndexOf('/')).toLocaleLowerCase();

        fs.rename(upload_file.path, local_path + changed_file_name, function() {
            res.send({ error : 0, url : http_url + changed_file_name })
        })
    })
}