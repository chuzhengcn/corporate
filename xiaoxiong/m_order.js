var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    async    = require("async"),
    moment   = require("moment"),
    m_recipe = require("./m_recipe").Recipe,
    m_product = require("./m_product").Product,
    m_cart   = require("./m_cart").Cart,
    m_addr   = require("./m_addr").Addr;

var order_schema = new Schema({
    open_id         : String,
    products        : [Schema.Types.Mixed],
    addr            : Schema.Types.Mixed,
    status          : Number,
    price           : Number,
    pay             : Number,
    create_at       : Number,
    create_date     : String,
    modify_at       : Number,
})

var order_status = exports.order_status = {
    "0" : "已取消",
    "1" : "已提交",
    "2" : "已确认",
    "3" : "正在采购",
    "4" : "采购完成",
    "5" : "正在配货",
    "6" : "配送中",
    "7" : "配送完成",
}

var pay_status = exports.pay_status = {
    "0" : "未付款",
    "1" : "已付款",
    "2" : "申请退款",
    "3" : "退款中",
    "4" : "退款完成",
}

order_schema.static("find_user_lasted_order", function(open_id, cb) {
    this.findOne({open_id : open_id}, null, {sort : {create_at : -1}}, function(err, doc) {
        cb(err, doc)
    })
})

order_schema.static("update_status_by_id", function(id, arg, cb) {
    var update_doc = {};

    Object.keys(arg).forEach(function(item) {
        update_doc[item] = parseInt(arg[item])
    })

    for (var key in update_doc) {
        if (typeof update_doc[key] === 'undefined') {
            delete update_doc[key]
        }

        if (["pay","status"].indexOf(key) === -1) {
            delete update_doc[key]
        }

        // warning : 必须检查客户端传来的参数名和参数值是否合法
    }

    console.log(update_doc)

    this.findByIdAndUpdate(id, update_doc, function(err, doc) {
        cb(err, doc)
    })
})

order_schema.static("user_list", function(open_id, page, cb) {
    var current_page = parseInt(page) || 1,
        per_page     = 5,
        skip_num     = (current_page - 1) * per_page,
        self         = this;

    async.parallel({
        orders : function(callback) {
            self.find({open_id: open_id}, null, {sort : {create_at : -1 }, limit : per_page, skip : skip_num}, function(err, docs) {
                if (err) {
                    return callback(err)
                }

                docs = docs.map(function(item) {
                    item = item.toJSON()
                    item.status = order_status[item.status.toString()]
                    item.pay    = pay_status[item.pay.toString()]
                    return item
                })

                callback(null, docs)
            })
        },

        total : function(callback) {
            self.count({open_id : open_id}, function(err, num) {
                if (err) {
                    return callback(err)
                }

                callback(null, num)
            })
        }

    }, function(err, result) {
        if (err) {
            return cb(err)
        }

        cb(null, result.orders, Math.ceil(result.total / per_page), current_page)
    })
})

order_schema.static("list", function(page, cb) {
    var current_page = parseInt(page) || 1,
        per_page     = 20,
        skip_num     = (current_page - 1) * per_page,
        self         = this;

    async.parallel({
        orders : function(callback) {
            self.find({}, null, {sort : {create_at : -1}, limit : per_page, skip : skip_num}, function(err, docs) {
                if (err) {
                    return callback(err)
                }

                docs = docs.map(function(item) {
                    item = item.toJSON()
                    item.status = order_status[item.status.toString()]
                    item.pay    = pay_status[item.pay.toString()]
                    return item
                })

                callback(null, docs)
            })
        },

        total : function(callback) {
            self.count({}, function(err, num) {
                if (err) {
                    return callback(err)
                }

                callback(null, num)
            })
        },
    },function(err, result) {
        if (err) {
            return cb(err)
        }

        cb(null, result.orders, Math.ceil(result.total / per_page), current_page)
    })
})

order_schema.static('create_order', function (open_id, cb) {
    var self    = this,
        price   = 0;

    async.parallel({
        addr : function(callback) {
            m_addr.find_last_used(open_id, function(err, addr_doc) {
                if (err) {
                    return callback(err)
                }

                if (!addr_doc) {
                    return callback('没有收货地址')
                }

                callback(null, {
                    userName : addr_doc.userName,
                    telNumber  : addr_doc.telNumber,
                    addressCitySecondStageName : addr_doc.addressCitySecondStageName,
                    addressCountiesThirdStageName : addr_doc.addressCountiesThirdStageName,
                    addressDetailInfo : addr_doc.addressDetailInfo,
                })
            })
        },

        products : function(callback) {
            m_cart.find_cart_with_product_by_openid(open_id, function(err, cart_docs) {
                if (err) {
                    return callback(err)
                }

                if (cart_docs.length < 1) {
                    return callback('购物车中没有商品')
                }

                cart_docs = cart_docs.map(function(item) {
                    price += (item.product.price * item.amount)
                    return {
                        product_id   : item.product_id,
                        title       : item.product.title,
                        price       : item.product.price,
                        amount      : item.amount
                    }
                })

                callback(null, cart_docs)

            })
        }
    },
    function(err, result) {
        var now = Date.now();

        var doc = {
            open_id : open_id,
            products : result.products,
            addr    : result.addr,
            price   : price,
            status  : 1,
            pay     : 0,
            create_at   : now,
            create_date : moment(now).format("YYYY-MM-DD"),
            modify_at   : now,
        }

        self.create(doc, function(err, order_doc) {
            if (err) {
                return cb(err)
            }
            m_cart.remove_cart_by_openid(open_id, function(err) {
                if (err) {
                    return cb(err)
                }

                cb(null, order_doc)
            })
        })
    })
})

order_schema.index({ open_id : 1})

exports.Order = mongoose.model('orders', order_schema)
