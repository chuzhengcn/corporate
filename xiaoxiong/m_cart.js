var async = require('async'),   
    moment = require('moment'), 
    m_product = require("./m_product").Product,
    mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var cart_schema = new Schema({
    open_id         : String,
    product_id      : String, 
    amount          : Number,   
    create_date     : String,
    create_at       : Number,
})

cart_schema.index({ open_id : 1, product_id : 1})

cart_schema.static("find_cart_with_product_by_openid", function(open_id, cb) {
    var self = this;

    self.find({open_id : open_id}, null, {sort : {create_at : -1}}, function(err, cart_docs) {
        if (err) {
            return cb(err)
        }

        var product_ids = cart_docs.map(function(item) {
            return item.product_id
        })

        m_product.find({_id : {$in : product_ids}}, function(err, product_docs) {
            if (err) {
                return cb(err)
            }

            cart_docs = cart_docs.map(function(cart_item) {
                product_docs.forEach(function(product_item) {
                    if (product_item._id.toString() === cart_item.product_id) {
                        cart_item = cart_item.toJSON()
                        cart_item.product = product_item
                    }
                })

                return cart_item
            })

            cb(null, cart_docs)
        })
    })
})

cart_schema.static('add_one_product', function(doc, cb) {
    var self = this,
        now  = Date.now();

    self.count({open_id : doc.open_id, product_id : doc.product_id}, function(err, num) {
        if (err) {
            return cb(err)
        }

        if (num !== 0) {
            self.findOneAndUpdate({open_id : doc.open_id, product_id : doc.product_id}, {$inc : {amount : 1}}, function(err, doc) {
                cb(err, doc)
            })
        } else {
            doc.create_date = moment(now).format("YYYY-MM-DD")
            doc.create_at   = now
            doc.amount      = 1

            self.create(doc, function(err, doc) {
                cb(err, doc)
            })
        }
    })
})

cart_schema.static("remove_cart_by_openid", function(open_id, cb) {
    this.remove({open_id : open_id}, function(err) {
        cb(err)
    })
})

var Cart = mongoose.model('carts', cart_schema)

exports.Cart = Cart;