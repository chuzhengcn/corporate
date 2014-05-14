(function () {
    $(function() {
        var $form = $('#create-menu-form'),
            $selected_product_input = $('#selected-product-input'),
            $selected_product = $("#selected-product"),
            input_item = '<input type="hidden" name="product" />';

        $form.submit(function(event) {
            var $self   = $(this);

            $.ajax({
                url     : $self.attr('action'),
                type    : $self.attr('method'),
                data    : $self.serialize(),
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert('添加列表错误，稍后再试')
                }

                alert('添加推荐列表成功')

                setTimeout(function() {
                    location.href = '/xiaoxiong-admin/menus' 
                })
            })

            event.preventDefault()
        })

        $(".list-group").delegate('.select-product-btn', 'click', function(event) {
            var id = $(this).data('id');

            $(this).parent().parent().clone().find('.select-product-btn')
                .removeClass('select-product-btn').addClass('remove-product-btn').html('删除').end().appendTo($selected_product)

            $selected_product_input.append(input_item).find("input:last").val(id)
        })

        $selected_product.delegate('.remove-product-btn', 'click', function(event) {
            var id  = $(this).data('id');

            $selected_product_input.find("input[value='" + id + "']").remove();

            $(this).parent().parent().fadeOut()

            event.preventDefault()
        })

        $("#search-product-btn").click(function(event) {
            alert('开发中')
            event.preventDefault()
        })
    })
})();