$(function(){

    $('#search_btn').button({
        icons:{
          primary:'ui-icon-search'
        }
    });
    $('#question_btn').button({
        icons:{
            primary:'ui-icon-lightbulb'
        }
    }).click(function () {
        if($.cookie('user')){
            $('#question').dialog('open');
        }else{
            $('#error').dialog('open');
            setTimeout(function () {
                $('#error').dialog('close');
                $('#login').dialog('open');
            },1000)
        }
    });

    /* 提问 */
    $('#question').dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 500,
        height: 360,
        buttons:{
            '发布':function () {
                $(this).submit({
                    url: 'add_content.php',
                    type: 'POST',
                    data: {
                        user: $.cookie('user'),
                        content: $('.uEditorIframe').contents().find('#iframeBody').html(),
                    },
                    beforeSubmit: function (formData, jqForm, options) {
                        $('#loading').dialog('open');
                        $('#question').dialog('widget').find('button').eq(1).button('disable');
                    },
                    success: function (responseText, statusText) {
                        // 判断是否提交成功
                        if(responseText){
                            $('#question').dialog('widget').find('button').eq(1).button('enable');
                            $('#loading').css('background','url(images/success.gif) no-repeat 20px center').html('数据新增成功');
                            setTimeout(function () {
                                $('#loading').dialog('close');
                                $('#question').dialog('close');
                                $('#question').resetForm();
                                $('#loading').css('background','url(images/loading.gif) no-repeat 20px center').html('数据交互中...');
                            },1000)
                        }
                    }
                });
            }
        }
    });
   $('.uEditorCustom').uEditor();


    /* 错误提示 */
    $('#error').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: false,     //按下 esc 无效
        resizable: false,
        draggable: false,
        width: 180,
        height: 50,
    }).parent().find('.ui-widget-header').hide();

    $('#member,#logout').hide();
    if($.cookie('user')){
        $('#member, #logout').show();
        $('#reg_a, #login_a').hide();
        $('#member').html($.cookie('user'));
    }else{
        $('#member, #logout').hide();
        $('#reg_a, #login_a').show();
    }
    // 点击退出，清空user，跳转到index.html
    $('#logout').click(function () {
        $.removeCookie('user');
        window.location.href = '/ajax/zhiwen/index.html';
    });


    $('#loading').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: false,     //按下 esc 无效
        resizable: false,
        draggable: false,
        width: 180,
        height: 50,
    }).parent().find('.ui-widget-header').hide();     //去掉 header 头


    $('#reg_a').click(function () {
        $('#reg').dialog('open');
    });

    $('#reg').dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 320,
        height: 340,
        buttons:{
          '提交':function () {
             $(this).submit()
          }
        }
    }).buttonset().validate({
        // 使用其他方式代替默认提交
        submitHandler: function (form) {
            //提交设置
            $(form).ajaxSubmit({
                url: 'add.php',
                type: 'POST',
                // 提交之前执行，数据验证
                beforeSubmit: function (formData,jqForm,options) {
                    // 提示加载
                    $('#loading').dialog('open');
                    // 避免提交按钮重复提交，禁用
                    $('#reg').dialog('widget').find('button').eq(1).button('disable');
                },
                // 提交成功
                success: function (responseText, statusText) {
                    // 判断是否提交成功
                    if(responseText){
                        $('#reg').dialog('widget').find('button').eq(1).button('enable');
                        $('#loading').css('background','url(images/success.gif) no-repeat 20px center').html('数据新增成功');
                        $.cookie('user',$('#user').val());
                        setTimeout(function () {
                            $('#loading').dialog('close');
                            $('#reg').dialog('close');
                            $('#reg').resetForm();
                            $('#reg span.star').html('*').removeClass('succ');
                            $('#loading').css('background','url(images/loading.gif) no-repeat 20px center').html('数据交互中...');
                            $('#member, #logout').show();
                            $('#reg_a, #login_a').hide();
                            $('#member').html($.cookie('user'));
                        },1000)
                    }
                }
            })
        },
        // 获取错误提示句柄,改变表单的高度
        showErrors: function (errorMap, errorList) {
            var errors = this.numberOfInvalids();
            if(errors>0){
                $('#reg').dialog('option','height',errors*20+340);
            }else {
                $('#reg').dialog('option','height',340);
            }
            // 执行默认的错误
            this.defaultShowErrors();

        },
        //高亮显示有错误的元素
        highlight: function (element, errorClass) {
            $(element).css('border','1px solid #630');
            $(element).parent().find('span').html('*').removeClass('succ');
        },
        // 成功的元素移出错误高亮
        unhighlight:function (element, errorClass) {
            $(element).css('border','1px solid #ccc');
            $(element).parent().find('span').html('&nbsp;').addClass('succ');
        },
        // 统一包裹错误提示
        errorLabelContainer: 'ol.reg_error',
        wrapper: 'li',
        // 使用JS对象键值对传参方式
        rules: {
            user: {
                required: true,
                minlength: 2,
                remote: {
                    url: 'is_user.php',
                    type: 'POST'
                }
            },
            pass: {
                required: true,
                minlength:true
            },
            email: {
                required: true,
                email: true
            },date: {
                date: true
            }
        },
        messages: {
            user: {
                required: '账号不得为空',
                minlength: jQuery.format("账号不得小于{0}位"),
                remote: '账号已存在！'
            },
            pass: {
                required: '密码不得为空',
                minlength: jQuery.format("密码不得小于{0}位")
            },
            email: {
                required: '邮箱不得为空',
                minlength: '请输入正确的邮箱'
            }
        }
    });

    // 日历
    $('#date').datepicker({
        changeMonth: true,
        changeYear: true,
        yearSuffix: '',
        maxDate: 0,
        yearRange: '1950:2020'
    });


    // 邮箱
    var host = ['aa','aaaa','aaaaaa','bb']
    $('#email').autocomplete({
        delay: 0,
        autoFocus: true,
        source: function (request, response) {
            // 获取用户输入的内容
        }
    });


    $('#login_a').click(function () {
        $('#login').dialog('open');
    });
    $('#login').dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 320,
        height: 240,
        buttons:{
            '提交':function () {
                $(this).submit()
            }
        }
    }).buttonset().validate({
        // 使用其他方式代替默认提交
        submitHandler: function (form) {
            //提交设置
            $(form).ajaxSubmit({
                url: 'login.php',
                type: 'POST',
                // 提交之前执行，数据验证
                beforeSubmit: function (formData,jqForm,options) {
                    // 提示加载
                    $('#loading').dialog('open');
                    // 避免提交按钮重复提交，禁用
                    $('#login').dialog('widget').find('button').eq(1).button('disable');
                },
                // 提交成功
                success: function (responseText, statusText) {
                    // 判断是否提交成功
                    if(responseText){
                        $('#login').dialog('widget').find('button').eq(1).button('enable');
                        $('#loading').css('background','url(images/success.gif) no-repeat 20px center').html('数据新增成功');
                        $.cookie('user',$('#user').val());
                        setTimeout(function () {
                            $('#loading').dialog('close');
                            $('#login').dialog('close');
                            $('#login').resetForm();
                            $('#login span.star').html('*').removeClass('succ');
                            $('#loading').css('background','url(images/loading.gif) no-repeat 20px center').html('数据交互中...');
                            $('#member, #logout').show();
                            $('#reg_a, #login_a').hide();
                            $('#member').html($.cookie('user'));
                        },1000)
                    }
                }
            })
        },
        // 获取错误提示句柄,改变表单的高度
        showErrors: function (errorMap, errorList) {
            var errors = this.numberOfInvalids();
            if(errors>0){
                $('#login').dialog('option','height',errors*20+240);
            }else {
                $('#login').dialog('option','height',240);
            }
            this.defaultShowErrors();
        },
        //高亮显示有错误的元素
        highlight: function (element, errorClass) {
            $(element).css('border','1px solid #630');
            $(element).parent().find('span').html('*').removeClass('succ');
        },
        // 成功的元素移出错误高亮
        unhighlight:function (element, errorClass) {
            $(element).css('border','1px solid #ccc');
            $(element).parent().find('span').html('&nbsp;').addClass('succ');
        },
        // 统一包裹错误提示
        errorLabelContainer: 'ol.login_error',
        wrapper: 'li',
        // 使用JS对象键值对传参方式
        rules: {
            user: {
                required: true,
                minlength: 2,
            },
            pass: {
                required: true,
                minlength:true
            }
        },
        messages: {
            user: {
                required: '账号不得为空',
                minlength: jQuery.format("账号不得小于{0}位"),
            },
            pass: {
                required: '密码不得为空',
                minlength: jQuery.format("密码不得小于{0}位")
            }
        }
    });

    /* 选项卡 */
    $('#tabs').tabs();

    /* 折叠卡 */
    $('#accordion').accordion({
        header: 'h3'
    });


});




















