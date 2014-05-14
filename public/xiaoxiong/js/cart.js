(function () {
    $(function() {
        var open_id = $('.container-fluid').data('openid'),
            amount = 0,
            total_price = 0,
            $amount = $('.cart span.amount'),
            $price  = $('.cart span.price');

        // 获取购物车数据
        $.ajax({
            url : "/xiaoxiong/cart/" + open_id,
        }).done(function(data) {
            if (data.ok !== 1 || data.cart.length < 1) {
                return 
            }

            data.cart.forEach(function(item) {
                amount += item.amount
                total_price += item.product.price * item.amount
            })

            $amount.html(amount)
            $price.html((total_price / 100).toFixed(2))


            $('.cart .no-product').addClass("hidden")
            $('.cart .have-product').removeClass("hidden")
        })

        // 加入购物车
        $(".add-cart-btn").click(function(event) {
            var product_id = $(this).data("productid");

            $.ajax({
                type : "post",
                url  : "/xiaoxiong/cart/" + open_id,
                data : {product_id : product_id},
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert("加入购物车失败，请重试")
                }
                alert('加入购物车成功')
                location.reload()
            })
        })
    })
})();