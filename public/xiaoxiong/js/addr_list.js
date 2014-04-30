(function () {
    $(function() {
        var $select_primary_btn = $(".select-primary");

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

        $select_primary_btn.eq(0).addClass("btn-success");

        $select_primary_btn.click(function(event) {
            var $self = $(this);

            $.ajax({
                type : "put",
                url : $self.data('url')
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert("选择失败")
                }

                $select_primary_btn.removeClass('btn-success');
                $self.addClass("btn-success");

                if (document.referrer.indexOf("cart") > -1) {
                    location.href = document.referrer
                } else {
                    location.reload()
                }
            })
        })
    })
})();