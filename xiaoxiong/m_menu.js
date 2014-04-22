var async = require('async'),    
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var menu_schema = new Schema({
    title   : String,
    content : Array,    
    publish_date : String,
    create_date : String,
    create_at : Number,
    modify_at : Number,
})

menu_schema.index({ publish_date : 1})

menu_schema.static("find_by_page", function (page, cb) {
    var per_page = 20,
        self = this;

    if (!page) {
        page = 1
    } else {
        page = parseInt(page)
    }

    var skip_num = (page - 1) * per_page;

    self.count({}, function(err, num) {
        self.find({}, null, {sort : {publish_date : -1}, skip : skip_num}, function(err, docs) {

            cb(err, docs, Math.ceil(num / per_page), page)
        })
    })
})

var Menu = mongoose.model('menus', menu_schema)

exports.Menu = Menu;