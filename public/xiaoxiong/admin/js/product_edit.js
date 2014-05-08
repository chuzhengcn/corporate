(function () {
    $(function() {
        var editor,
            $form = $('#edit-product-form');

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
                    return alert('更新产品错误，稍后再试')
                }

                alert('更新产品成功')

                setTimeout(function() {
                    location.href = $self.attr('action') 
                })
            })

            event.preventDefault()
        })

        $('.auto_type').delegate("select", "change", function(event) {
            var cur_select = $(this),
                index      = $('.auto_type select').index(this),
                type_id = cur_select.val();

            search_children(type_id, function(children) {
                $('.auto_type select:gt('+ index +')').remove()

                if (children.length < 1) {
                    return
                }

                $('.auto_type').append("<select name='type' class='form-control'></select>")

                children.forEach(function(item) {
                    $('.auto_type select:last').append("<option value='" + item._id + "'>" + item.title +"</option>")
                })

                $('.auto_type select:last').change()
            })
        })

        function search_children(type_id, cb) {
            $.ajax({
                "type" : "get",
                "url"  : "/xiaoxiong-admin/products-types-children/" + type_id,
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert('获取子类别出错')
                }

                cb(data.children)
            })
        }

        $('#remove-product-btn').click(function(event) {
            event.preventDefault()

            if (!confirm("确认删除?")) {
                return
            }

            var self = $(this);

            $.ajax({
                url : self.attr("href"),
                type : "delete"
            }).done(function(data) {
                if (data.ok !== 1) {
                    return alert('删除失败')
                }

                location.href = "/xiaoxiong-admin/products";
            })
        })
    })
})();