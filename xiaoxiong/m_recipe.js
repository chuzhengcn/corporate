var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var recipe_schema = new Schema({
    title : String,
    content : String,
    thumbnail: String,
    original_price: Number,
    price: Number,
    create_date : String,
    create_at : Number
})

recipe_schema.index({ title : 1})

recipe_schema.static("find_by_page", function (page, cb) {
    var per_page = 20;

    if (!page) {
        page = 1
    } else {
        page = parseInt(page)
    }

    var skip_num = (page - 1) * per_page;

    this.find({}, null, {sort : {create_at : -1}, skip : skip_num}, function(err, docs) {
        cb(err, docs)
    })
})

var Recipe = mongoose.model('menu', recipe_schema)

exports.Recipe = Recipe;