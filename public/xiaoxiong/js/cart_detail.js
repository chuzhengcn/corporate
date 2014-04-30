(function () {
    $(function() {
        var open_id = $('.container-fluid').data('openid'),
            $cart_table = $("#cart-table"),
            $total_price = $("#total-price")
            total_price = 0;

        // 获取购物车数据
        $.ajax({
            url : "/xiaoxiong/cart/" + open_id,
        }).done(function(data) {
            if (data.ok !== 1 || data.cart.length < 1) {
                alert('获取购物车数据出错，请重试')
                return 
            }

            data.cart.forEach(function(item) {
                var item_price = item.recipe.price * item.amount
                $cart_table.append('<tr><td><img class="thumbnail_in_list" src="' +
                    item.recipe.thumbnail + 
                    '"/></td><td>' +
                    item.recipe.title +
                    '</td><td>' +
                    item.amount +
                    '</td><td>' +
                    (item_price / 100).toFixed(2) +
                    "元</td></tr>")
                total_price += item_price
            })

            $total_price.html((total_price / 100).toFixed(2))
        })
    })
})()