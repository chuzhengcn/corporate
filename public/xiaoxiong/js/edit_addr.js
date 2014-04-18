(function () {
    $(function() {
        var $form = $('#edit-addr-form');

        $form.submit(function(event) {
            var $self   = $(this),
                addr_id = $self.find('input[name="addr_id"]').val(),
                open_id = $self.find('input[name="user_open_id"]').val();

            $.ajax({
                url     : "/xiaoxiong/addr/" + addr_id + "/user/" + open_id,
                type    : "put",
                data    : $self.serialize(),
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert('修改地址错误，稍后再试')
                }

                alert('修改地址成功')

                setTimeout(function() {
                    location.href = '/xiaoxiong/addr/' + open_id 
                })
            })

            event.preventDefault()
        })
    })
})();