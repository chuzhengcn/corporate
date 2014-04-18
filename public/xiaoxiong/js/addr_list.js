(function () {
    $(function() {
        $(".btn-danger").click(function(event) {
            var sure = confirm('确认删除?')

            if (!sure) {
                return 
            }

            $.ajax({
                url : $(this).data('url'),
                type: "delete"
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert('删除地址错误，稍后再试')
                }

                alert('删除地址成功')

                setTimeout(function() {
                    location.reload()
                }, 1000)
            })
        })
    })
})();