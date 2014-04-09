var mongoose = required('mongoose'),
    Schema   = mongoose.Schema;

var user_schema = new Schema({
    open_id : String,
})

user_schema.index({ open_id : 1})

var User = mongoose.model('users', user_schema)

exports.User = User;