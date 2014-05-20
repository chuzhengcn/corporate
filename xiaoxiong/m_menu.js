var async = require('async'),   
    moment = require('moment'), 
    m_recipe = require("./m_recipe").Recipe,
    m_product = require("./m_product").Product,
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var menu_schema = new Schema({
    title           : String,
    description     : {type : String, default : ""},
    cover_img       : String,
    content         : Array,   
    top             : {type : Array, default : []}, 
    publish_date    : String,
    create_date     : String,
    create_at       : Number,
    modify_at       : Number,
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

menu_schema.static('find_by_id_and_products', function(id, cb) {
    var self = this;

    async.waterfall([
        function(calllback) {
            self.findById(id, function(err, doc) {
                calllback(err, doc)
            })
        },

        function(doc, calllback) {
            m_product.find({_id : {$in : doc.content}}, function(err, product_docs) {
                if (err) {
                    return calllback(err)
                }
                doc.products = product_docs
                calllback(null, doc)
            })
        },

        function(doc, calllback) {
            m_product.find({_id : {$in : doc.top}}, function(err, top_docs) {
                if (err) {
                    return calllback(err)
                }
                doc.top = top_docs
                calllback(null, doc)
            })
        }
    ],
    function(err, reslut) {
        cb(err, reslut)
    })
})

menu_schema.static('find_today', function(cb) {
    var today     = moment().format("YYYY-MM-DD");

    this.findOne({publish_date : today}, function(err, doc) {
        if (!doc) {
            return cb(null, null)
        }

        async.parallel({
            products : function(calllback) {
                m_product.find({_id : {$in : doc.content}}, function(err, product_docs) {
                    if (err) {
                        return cb(err)
                    }

                    calllback(null, product_docs)
                })
            },

            top: function(calllback) {
                m_product.find({_id : {$in : doc.top}}, function(err, product_docs) {
                    if (err) {
                        return cb(err)
                    }
                    
                    calllback(null, product_docs)
                })
            },
        },
        function(err, reslut) {
            if (err) {
                return cb(err)
            }

            doc.products = reslut.products;
            doc.top = reslut.top;

            cb(null, doc)
        })
    })
})

menu_schema.static('find_top_today', function(cb) {
    var today     = moment().format("YYYY-MM-DD");

    this.findOne({publish_date : today}, function(err, doc) {
        if (!doc) {
            return cb(null, null)
        }

        m_product.find({_id : {$in : doc.top}}, function(err, product_docs) {
            if (err) {
                return cb(err)
            }

            doc.products = product_docs
            cb(null, doc)
        })
    })
})

menu_schema.static("find_today_no_product", function(cb) {
    var today = moment().format("YYYY-MM-DD");

    this.findOne({publish_date : today}, null, {sort : {modify_at : -1}}, function(err, doc) {
        if (!doc) {
            return cb(null, null)
        }

        cb(err, doc)

    })
})

var Menu = mongoose.model('menus', menu_schema)

exports.Menu = Menu;