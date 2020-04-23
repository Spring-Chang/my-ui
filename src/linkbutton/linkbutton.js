/**
 * MyUI for jQuery
 *
 * Copyright (c) 2020 张翠山
 *
 * MIT License
 *
 * 联系作者：290794272@qq.com(张翠山)
 *
 * linkbuton组件 - MyUI for jQuery
 *
 * 版本：0.0.1
 */

(function ($) {

    //初始化函数
    function createButton(jq) {

        //从元素节点中取出参数
        var data = $.data(jq, 'linkbutton');

        var opts = data.options;

        $(jq).addClass('l-btn l-btn-small').css({
            "width" : opts.width+"px",
            "height" : opts.height+"px"
        });
        if(opts.disable) {
            $(jq).addClass('l-btn-disabled');
        }

        $(jq).html('<span class="l-btn-left"><span class="l-btn-text">'+opts.text+'</span></span>');
    }

    //处理按钮启动或者禁用状态
    function setDisabled(jq, disabled) {
        if(disabled) {
            $.data(jq, 'linkbutton').options.disable = true;
            $(jq).addClass("l-btn-disabled");

            var hrefValue = $(jq).attr("href");
            if(hrefValue) {
                $.data(jq, 'linkbutton').href = hrefValue;                
            }

            $(jq).removeAttr('href');//去掉a标签中的href属性
            $(jq).removeAttr('onclick');//去掉a标签中的onclick事件
        } else {
            $.data(jq, 'linkbutton').options.disable = false;
            var href =  $.data(jq, 'linkbutton').href;
            $(jq).attr('href', href);
            $(jq).removeClass("l-btn-disabled");
        }
    }

    //linkbutton组件入口函数
    $.fn.linkbutton = function (options) {
        options = options || {};

        if(typeof options == 'string') { //options如果为字符串，则为调用函数

            var method = $.fn.linkbutton.methods[options];
            if(method) { //判断函是否存在
                return method(this);
            }
        }

        $(this).each(function () {

            var opts = $.extend({}, $.fn.linkbutton.defaults, options);

            //将参数存入元素节点中
            $.data(this, 'linkbutton', {options : opts});

            createButton(this);
        });
    }

    //linkbutton组件方法集
    $.fn.linkbutton.methods = {
        options: function(jq) {
            return $.data(jq[0], 'linkbutton').options;
        },
        disable: function (jq) {
            return $(jq).each(function () {
                setDisabled(this, true);
            });
        },
        enable: function (jq) {
            return $(jq).each(function () {
                setDisabled(this, false);
            });
        },
        resize: function () {

        }
    }

    //linkbutton插件默认值
    $.fn.linkbutton.defaults = {
        width: 100,
        height: 30,
        disable: true,
        text:'Button',
        size: 'normal',
        onClick: function () {
            console.log('--默认回调函数--');
        }
    }

})(jQuery);
