var mongoose = required('mongoose'),
    Schema   = mongoose.Schema;

var addr_schema = new Schema({
    open_id : String,
})

addr_schema.index({ open_id : 1})

var Addr = mongoose.model('addr', addr_schema)

exports.Addr = Addr;