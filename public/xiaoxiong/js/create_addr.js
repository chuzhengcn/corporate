(function () {
    $(function() {
        $('#create-addr-form').submit(function(event) {
            var $self   = $(this),
                open_id = $self.find('input[name="user_open_id"]').val();

            $.ajax({
                url     : "/xiaoxiong/addr",
                type    : "post",
                data    : $self.serialize(),
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert('创建地址错误，稍后再试')
                }

                location.href = '/xiaoxiong/addr/' + open_id 
            })

            event.preventDefault()
        })
    })
})();