// 回复我的地址响应 ------------------------------------------------------------------
function send_event_my_addr_response(req, res) {
    console.log(req.weixin_user_msg)
}
exports.send_event_my_addr_response = send_event_my_addr_response;