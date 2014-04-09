(function() {
    $(function() {
        $("#signin-form").on("submit", function(event) {
            $self = $(this);

            $.ajax({
                url     : $self.attr('action'),
                type    : $self.attr('method'),
                data    : $self.serialize()
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert(data.msg)
                }

                location.href = '/xiaoxiong-admin'
            })

            event.preventDefault()
        })
    })
})();