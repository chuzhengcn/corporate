(function() {
    $(function() {
        var order_id = $("h3:first em").text()

        $(".change_order_status_btn_group a").click(function(event) {
            event.preventDefault();

            var send_data = {};
            send_data[$(this).parent().parent().data("name") ] = $(this).attr("href")

            $.ajax({
                url : "/xiaoxiong-admin/orders/" + order_id,
                type : "put",
                data : send_data,
            }).done(function(data) {
                if (data.ok === 1) {
                    location.reload()
                } else {
                    alert(data.msg)
                }
            })
        })
    })
})();