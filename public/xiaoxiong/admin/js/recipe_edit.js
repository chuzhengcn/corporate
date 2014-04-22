(function () {
    $(function() {
        var editor,
            $form = $('#edit-recipe-form');

        $('#fileupload_preview').show();

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
                    alert('上传文件出错, 图片最大2m')
                }

                ('success', '上传文件成功', '')

                // $('#fileupload').hide()
                $('#fileupload_url').val(data.result.url)
                $('#fileupload_preview').show().attr('src', data.result.url)
                
            }
        });

        $form.submit(function(event) {
            var $self   = $(this);
            editor.sync()
            
            $.ajax({
                url     : $self.attr('action'),
                type    : $self.attr('method'),
                data    : $self.serialize(),
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert('更新菜谱错误，稍后再试')
                }

                alert('更新菜谱成功')

                setTimeout(function() {
                    location.href = $self.attr('action') 
                })
            })

            event.preventDefault()
        })
    })
})();