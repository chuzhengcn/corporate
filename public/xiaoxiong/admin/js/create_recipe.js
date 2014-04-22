(function () {
    $(function() {
        var editor,
            $form = $('#create-addr-form');

        KindEditor.ready(function(K) {
            editor = K.create('#content-editor', {
                resizeType : 1,
                uploadJson : '/xiaoxiong-admin/upload/editor',
                items : [
                    'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                    'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                    'insertunorderedlist', '|', 'image']
            });
        });

        $('#fileupload').fileupload({
            dataType: 'json',
            done: function (event, data) {
                if (data.result.ok !== 1) {
                    alert('上传文件出错, 图片最大5m')
                }

                ('success', '上传文件成功', '')

                // $('#fileupload').hide()
                $('#fileupload_url').val(data.result.url)
                $('#fileupload_preview').show().attr('src', data.result.url)
                
            }
        });

        $form.submit(function(event) {
            var $self   = $(this);

            $.ajax({
                url     : $self.attr('action'),
                type    : $self.attr('method'),
                data    : $self.serialize(),
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert('添加菜谱错误，稍后再试')
                }

                alert('添加菜谱成功')

                setTimeout(function() {
                    location.href = '/xiaoxiong-admin/recipes' 
                })
            })

            event.preventDefault()
        })
    })
})();