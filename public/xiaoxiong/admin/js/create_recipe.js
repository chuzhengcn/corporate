(function () {
    $(function() {
        var editor;

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
    })
})();