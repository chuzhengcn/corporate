(function () {
    $(function() {
        $("#add_type_form").submit(function(event) {
            event.preventDefault()
            var self = $(this);

            $.ajax({
                url : self.attr("action"),
                type : self.attr("method"),
                data : self.serialize(),
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert("添加失败")
                }

                location.reload()
            })
        })

        $(".edit_type_btn").click(function(event) {
            event.preventDefault()
            var name = $(this).parent().prev().text(),
                url = $(this).attr('href');

            $("#edit_type_form").attr("action", url)

            $("#edit_type_form").find("input[name='title']").val(name)

            $('#edit_type_modal').modal()
        })

        $("#edit_type_form").submit(function(event) {
            event.preventDefault()
            var self = $(this);

            $.ajax({
                url : self.attr("action"),
                type : self.attr("method"),
                data : self.serialize(),
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert("编辑失败")
                }

                location.reload()
            })
        })
    })
})()