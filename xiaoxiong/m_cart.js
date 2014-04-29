var async = require('async'),   
    moment = require('moment'), 
    m_recipe = require("./m_recipe").Recipe,
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var cart_schema = new Schema({
    user_open_id    : String,
    recipe_id       : String, 
    amount          : Number,   
    create_date     : String,
    create_at       : Number,
})

cart_schema.index({ user_open_id : 1, recipe_id : 1})

cart_schema.static("find_cart_with_recipe_by_openid", function(open_id, cb) {
    var self = this;

    self.find({user_open_id : open_id}, null, {sort : {create_at : -1}}, function(err, cart_docs) {
        if (err) {
            return cb(err)
        }

        var recipe_ids = cart_docs.map(function(item) {
            return item.recipe_id
        })

        m_recipe.find({_id : {$in : recipe_ids}}, function(err, recipe_docs) {
            if (err) {
                return cb(err)
            }

            cart_docs = cart_docs.map(function(cart_item) {
                recipe_docs.forEach(function(recipe_item) {
                    if (recipe_item._id.toString() === cart_item.recipe_id) {
                        cart_item = cart_item.toJSON()
                        cart_item.recipe = recipe_item
                    }
                })

                return cart_item
            })

            cb(null, cart_docs)
        })
    })
})

cart_schema.static('add_one_recipe', function(doc, cb) {
    var self = this,
        now  = Date.now();

    self.count({user_open_id : doc.user_open_id, recipe_id : doc.recipe_id}, function(err, num) {
        if (err) {
            return cb(err)
        }

        if (num !== 0) {
            self.findOneAndUpdate({user_open_id : doc.user_open_id, recipe_id : doc.recipe_id}, {$inc : {amount : 1}}, function(err, doc) {
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

var Cart = mongoose.model('carts', cart_schema)

exports.Cart = Cart;