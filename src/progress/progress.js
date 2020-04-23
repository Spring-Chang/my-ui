/**
 * MyUI for jQuery
 *
 * Copyright (c) 2020 张翠山
 *
 * MIT License
 *
 * 联系作者：290794272@qq.com(张翠山)
 *
 * progress组件 - MyUI for jQuery
 *
 * 版本：0.0.1
 */

(function ($) {

    var handler = null;

    //初始化工作函数
    function init(target) {
        //1.给P标签新增class
        $(target).addClass("progressbar");

        //2.给p标签添加子标签
        $(target).html('<div class="progressbar-text" "></div>'+
            '<div class="progressbar-value">'+
            '<div class="progressbar-text"></div>'+
            '</div>');

        return $(target);
    }

    //设置size函数
    function setSize(target, width){

        var opts = $.data(target, 'progress').options;
        var bar = $.data(target, 'progress').bar;
        if (width) {
            opts.width = width;
        }

        bar.width(opts.width);
        bar.find('div.progressbar-text').css('width', opts.width);
        bar.find('div.progressbar-text,div.progressbar-value').css({
            height: opts.height+'px',
            lineHeight: opts.lineHeight+'px'
        });
    }

    //插件入口
    $.fn.progress = function (options, params) {

        if(typeof options == 'string') {
            var fn = $.fn.progress.methods[options]; //获取方法
            if(fn) {
                return fn(this, params);
            }
        }

        options = options || {};

        this.each(function () {

            var progressObject = {
                options: $.extend({}, $.fn.progress.defaults, options),
                bar: init(this)
            };

            $.data(this, 'progress', progressObject);

            //设置目标元素的值
            $.fn.progress.methods.setValue(this, progressObject.options.value);

            setSize(this);
        });
    }

    //原型链上的属性
    $.fn.progress.methods = {
        options: function(jq) {
            return $.data(jq[0], 'progress').options;
        },
        setValue: function (jq, value) {

          return $(jq).each(function () {
              var opts = $.data(this, 'progress').options;
              var text = opts.text.replace(/{value}/, value);

              $(this).find('div.progressbar-value').width(value + '%');
              $(this).find('div.progressbar-text').html(text);

              var oldValue = opts.value;
              if(oldValue != value) { //如果新值不等于旧的值，触发回调函数
                  opts.onChange(value, oldValue);
                  opts.value = value;
                  // opts.onChange.call(this, value, oldValue);
              }
          });
        },
        getValue: function (jq) {
            return $.data(jq[0], 'progress').options.value;
        },
        resize: function (jq, width) {
            return jq.each(function () {
                setSize(this, width);
            });
        },
        start: function (jq, speed) {
            speed = speed || 100;
            if(typeof speed == 'string') {
                if('fast' == speed) {
                    speed = 50;
                } else if('normal' == speed) {
                    speed = 100;
                } else if('slow' == speed) {
                    speed = 200;
                } else {
                    speed = 100;
                }
            }

            window.clearInterval(handler);//每次触发都先清除一次
            var value = 0;
            function run(){
                if (value >= 100){
                    value = 0;
                }
                value ++;
                $.fn.progress.methods.setValue(jq, value);
                value = $.fn.progress.methods.getValue(jq);
            }
            handler = window.setInterval(run, speed);
        },
        stop: function (jq) {
            window.clearInterval(handler);
        }
    };

    //插件默认值
    $.fn.progress.defaults = {
        width: 'auto',
        height: 22,
        value: 0,	// percentage value
        text: '{value}%',
        onChange: function (oldValue, newValue) {//空实现的回调函数
        }
    };

})(jQuery);
