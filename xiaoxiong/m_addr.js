var mongoose = required('mongoose'),
    Schema   = mongoose.Schema;

var addr_schema = new Schema({
    open_id         : String,
    tel             : String,
    name            : String,
    postcode        : Number,
    area            : String,
    detail          : String,
    last_used_at    : Number
})

addr_schema.index({ open_id : 1})

addr_schema.static.find_last_used = function (open_id, cb) {
    this.findOne({open_id : open_id}, null, {sort : {last_used_at : -1}}, function(err, doc) {
        cb(err, doc)
    })
}

var Addr = mongoose.model('addr', addr_schema)

exports.Addr = Addr;