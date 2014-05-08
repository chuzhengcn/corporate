var async       = require('async'),    
    mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

var product_type_schema = new Schema({
    title               : String,
    create_date         : String,
    create_at           : Number,
    modify_at           : Number,
    parent_type         : {type : String, default : "no_parent"},
    remove              : {type : String, default : "no"},
})

product_type_schema.index({ title : 1})

product_type_schema.static("find_top_level", function (cb) {
    this.find({parent_type : "no_parent", remove : "no"}, null, {sort : {modify_at : -1}}, function(err, docs) {
        cb(err, docs)
    })
})

product_type_schema.static("find_self_and_children", function (id, cb) {
    var self = this;

    async.parallel({
        cur_type : function(callback) {
            self.findById(id, function(err, doc) {
                callback(err, doc)
            })
        },

        parents : function(callback) {
            var top = false,
                target = id,
                bread_result = [];

            async.doUntil(function(until_callback) {
                self.findById(target, function(err, doc) {
                    if (err || !doc) {
                        return callback(err)
                    }

                    if (doc.parent_type === 'no_parent') {
                        top = true
                    }

                    bread_result.unshift(doc)
                    target = doc.parent_type
                    until_callback()
                })
            }, function() {return top}, function(err) {
                callback(err, bread_result)
            })
        },
        children : function(callback) {
            self.find({parent_type : id}, null, {sort : {modify_at : -1}}, function(err, docs) {
                callback(err, docs)
            })
        },
    },
    function(err, result) {
        cb(err, result)
    })
})

product_type_schema.static("find_type_bread", function(id, cb) {
    var self = this,
        top = false,
        target = id,
        bread_result = [];

    async.doUntil(function(until_callback) {
        self.findById(target, function(err, doc) {
            if (err || !doc) {
                return cb(err)
            }

            if (doc.parent_type === 'no_parent') {
                top = true
            }

            bread_result.unshift(doc)
            target = doc.parent_type
            until_callback()
        })
    }, function() {return top}, function(err) {
        cb(err, bread_result)
    })

})

exports.ProductType = mongoose.model('product_types', product_type_schema)