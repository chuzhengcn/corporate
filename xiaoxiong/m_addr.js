var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var addr_schema = new Schema({
    open_id                         : String,
    userName                        : String,
    telNumber                       : String,
    addressPostalCode               : {type : Number, default : 518000},
    proviceFirstStageName           : {type : String, default : "广东"},
    addressCitySecondStageName      : {type : String, default : "深圳"},
    addressCountiesThirdStageName   : String,
    addressDetailInfo               : String,
    nationalCode                    : {type : String, default : "86"},
    last_used_at                    : {type : Number, default : Date.now()},
    created_at                      : {type : Number, default : Date.now()},
})

addr_schema.index({ open_id : 1})

addr_schema.static("find_last_used", function (open_id, cb) {
    this.findOne({open_id : open_id}, null, {sort : {last_used_at : -1}}, function(err, doc) {
        cb(err, doc)
    })
})

var Addr = mongoose.model('addr', addr_schema)

exports.Addr = Addr;