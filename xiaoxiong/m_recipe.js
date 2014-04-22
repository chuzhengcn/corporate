var async = require('async'),    
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var recipe_schema = new Schema({
    title : String,
    content : String,
    thumbnail: String,
    original_price: Number,
    price: Number,
    create_date : String,
    create_at : Number,
    modify_at : Number,
})

recipe_schema.index({ title : 1})

recipe_schema.static("find_by_page", function (page, cb) {
    var per_page = 20,
        self = this;

    if (!page) {
        page = 1
    } else {
        page = parseInt(page)
    }

    var skip_num = (page - 1) * per_page;

    self.count({}, function(err, num) {
        self.find({}, null, {sort : {create_at : -1}, skip : skip_num}, function(err, docs) {

            cb(err, docs, Math.ceil(num / per_page), page)
        })
    })
})

var Recipe = mongoose.model('recipe', recipe_schema)

exports.Recipe = Recipe;