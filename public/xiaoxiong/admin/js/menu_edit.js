(function () {
    $(function() {
        var $form = $('#edit-menu-form'),
            $selected_products_input = $('#selected-products-input'),
            $selected_products = $("#selected-products"),
            input_item = '<input type="hidden" name="product" />';

        $form.submit(function(event) {
            var $self   = $(this);

            $.ajax({
                url     : $self.attr('action'),
                type    : $self.attr('method'),
                data    : $self.serialize(),
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert('修改菜单错误，稍后再试')
                }

                alert('修改菜单成功')

                setTimeout(function() {
                    location.href = $self.attr('action')
                })
            })

            event.preventDefault()
        })

        $(".list-group").delegate('.select-product-btn', 'click', function(event) {
            var id = $(this).data('id');

            $(this).parent().parent().clone().find('.select-product-btn')
                .removeClass('select-product-btn').addClass('remove-product-btn').html('删除').end().appendTo($selected_products)

            $selected_products_input.append(input_item).find("input:last").val(id)
        })

        $selected_products.delegate('.remove-product-btn', 'click', function(event) {
            var id  = $(this).data('id');

            $selected_products_input.find("input[value='" + id + "']").remove();

            $(this).parent().parent().fadeOut()

            event.preventDefault()
        })

        $("#search-product-btn").click(function(event) {
            alert('开发中')
            event.preventDefault()
        })
    })
})();