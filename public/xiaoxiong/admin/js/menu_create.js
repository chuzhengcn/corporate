(function () {
    $(function() {
        var $form = $('#create-menu-form');

        $form.submit(function(event) {
            var $self   = $(this);

            $.ajax({
                url     : $self.attr('action'),
                type    : $self.attr('method'),
                data    : $self.serialize(),
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert('添加菜单错误，稍后再试')
                }

                alert('添加菜单成功')

                setTimeout(function() {
                    location.href = '/xiaoxiong-admin/menus' 
                })
            })

            event.preventDefault()
        })
    })
})();