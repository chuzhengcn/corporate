(function () {
    $(function() {
        var $form = $('#edit-menu-form'),
            $selected_recipes_input = $('#selected-recipes-input'),
            $selected_recipes = $("#selected-recipes"),
            input_item = '<input type="hidden" name="recipe" />';

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

        $(".list-group").delegate('.select-recipe-btn', 'click', function(event) {
            var id = $(this).data('id');

            $(this).parent().parent().clone().find('.select-recipe-btn')
                .removeClass('select-recipe-btn').addClass('remove-recipe-btn').html('删除').end().appendTo($selected_recipes)

            $selected_recipes_input.append(input_item).find("input:last").val(id)
        })

        $selected_recipes.delegate('.remove-recipe-btn', 'click', function(event) {
            var id  = $(this).data('id');

            $selected_recipes_input.find("input[value='" + id + "']").remove();

            $(this).parent().parent().fadeOut()

            event.preventDefault()
        })

        $("#search-recipe-btn").click(function(event) {
            alert('开发中')
            event.preventDefault()
        })
    })
})();