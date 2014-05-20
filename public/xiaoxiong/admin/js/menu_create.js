(function () {
    $(function() {
        var $form = $('#create-menu-form'),
            $selected_product_input = $('#selected-product-input'),
            $selected_product = $("#selected-product"),
            $top_selected_products_input = $('#top-products-input'),
            $top_products = $("#top-products"),
            input_item = '<input type="hidden" name="product" />',
            input_item_top = '<input type="hidden" name="top" />';

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

        $('#fileupload').fileupload({
            dataType: 'json',
            done: function (event, data) {
                if (data.result.ok !== 1) {
                    alert('上传文件出错, 图片最大2m')
                }

                // ('success', '上传文件成功', '')

                // $('#fileupload').hide()
                $('#fileupload_url').val(data.result.url)
                $('#fileupload_preview').show().attr('src', data.result.url)
                
            }
        });

        $(".list-group").delegate('.select-product-btn', 'click', function(event) {
            var id = $(this).data('id');

            $(this).parent().parent().clone().find('.select-product-btn')
                .removeClass('select-product-btn').addClass('remove-product-btn').html('删除').end()
                .find('.set-top-product-btn').remove().end().appendTo($selected_product)

            $selected_product_input.append(input_item).find("input:last").val(id)
        })

        $(".list-group").delegate('.set-top-product-btn', 'click', function(event) {
            var id = $(this).data('id');

            $(this).parent().parent().clone().find('.set-top-product-btn')
                .removeClass('set-top-product-btn').addClass('remove-top-product-btn').html('删除').end()
                .find('.select-product-btn').remove().end().appendTo($top_products)

            $top_selected_products_input.append(input_item_top).find("input:last").val(id)
        })

        $selected_product.delegate('.remove-product-btn', 'click', function(event) {
            var id  = $(this).data('id');

            $selected_product_input.find("input[value='" + id + "']").remove();

            $(this).parent().parent().fadeOut()

            event.preventDefault()
        })

        $top_products.delegate('.remove-product-btn', 'click', function(event) {
            var id  = $(this).data('id');

            $top_selected_products_input.find("input[value='" + id + "']").remove();

            $(this).parent().parent().fadeOut()

            event.preventDefault()
        })

        $("#search-product-btn").click(function(event) {
            alert('开发中')
            event.preventDefault()
        })
    })
})();