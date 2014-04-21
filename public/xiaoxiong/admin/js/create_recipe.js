(function (argument) {
    $(function() {

        $('#fileupload').fileupload({
            dataType: 'json',
            done: function (event, data) {
                if (data.result.ok !== 1) {
                    App.show_message('danger', '上传文件出错', data.result.msg)
                }

                App.show_message('success', '上传文件成功', '')

                setTimeout(function() {
                    location.reload()
                }, 500)
                // $.each(data.result.files, function (index, file) {
                //     $('<p/>').text(file.name).appendTo(document.body);
                // });
            }
        });
    })
})();