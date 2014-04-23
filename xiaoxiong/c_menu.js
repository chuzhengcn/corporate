var m_menu      = require("./m_menu"),
    util        = require("util"),
    lib_util    = require("../lib/util"),
    weixin      = require("../lib/c_weixin"),
    my_open_id  = weixin.my_open_id,
    domain      = "http://www.feiyesoft.com";

exports.send_event_today_menu_response = function(req, res) {
    var user_open_id            = req.weixin_user_msg.FromUserName[0],
        encypted_user_open_id   = lib_util.encipher(user_open_id);

    var template =  '<xml>' +
                        '<ToUserName><![CDATA[%s]]></ToUserName>' +
                        '<FromUserName><![CDATA[%s]]></FromUserName>' +
                        '<CreateTime>%d</CreateTime>' +
                        '<MsgType><![CDATA[news]]></MsgType>' +
                        '<ArticleCount><![CDATA[%d]]></ArticleCount>' + 
                        '<Articles></Articles>' + 
                    '</xml>';
    var item_template = "<item>" +
                            "<Title><![CDATA[%s]]></Title>" + 
                            "<Description><![CDATA[%s]]></Description>" +
                            "<PicUrl><![CDATA[%s]]></PicUrl>" +
                            "<Url><![CDATA[%s]]></Url>" +
                        "</item>";

    m_menu.find_today(function(err, docs) {
        var menus = docs.recipes.map(function(item, index) {
            return {
                title : item.title,
                pic_url : item.thumbnail,
                description : item.content,
                url : domain + '/xiaoxiong/recipe/' + item._id + "?open_id=" + encypted_user_open_id
            }
        })

        var items = "";

        menus.forEach(function(item) {
            items += util.format(item_template, item.title, item.description, item.pic_url, item.url)
        })

        template = util.format(template, user_open_id, my_open_id, Date.now(), menu.length);

        var insert_point = template.lastIndexOf('Articles') - 2

        var reply_content = template.slice(0, insert_point) + items + template.slice(insert_point)

        res.type('xml')
        res.send(reply_content)

    })
}