var async = require('async'),    
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var product_schema = new Schema({
    title               : String,
    content             : String,
    thumbnail           : {type : String, default : "/xiaoxiong/img/blank-product.jpg"},
    original_price      : Number,
    price               : Number,
    create_date         : String,
    create_at           : Number,
    modify_at           : Number,
    type                : String,
    remove              : {type : String, default : "no"},
})

product_schema.index({ title : 1, type : 1})

product_schema.static("find_by_page", function (page, cb) {
    var per_page = 20,
        self = this;

    if (!page) {
        page = 1
    } else {
        page = parseInt(page)
    }

    var skip_num = (page - 1) * per_page;

    self.count({}, function(err, num) {
        self.find({remove : "no"}, null, {sort : {create_at : -1}, skip : skip_num, limit : per_page}, function(err, docs) {

            cb(err, docs, Math.ceil(num / per_page), page)
        })
    })
})

product_schema.static("find_newest_by_create_at", function(num, cb) {
    var self = this;

    self.find({remove : "no"}, null, {sort : {create_at : -1}, limit : num}, function(err, docs) {
        cb(err, docs)
    })
})

product_schema.static("find_newest_by_modify_at", function(num, cb) {
    var self = this;

    self.find({remove : "no"}, null, {sort : {modify_at : -1}, limit : num}, function(err, docs) {
        cb(err, docs)
    })
})

exports.Product = mongoose.model('products', product_schema)