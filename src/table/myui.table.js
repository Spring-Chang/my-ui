/**
 * drill table plugin version 2.0.0
 *
 * 钻井table表格插件,专为钻井定制化开发,基于jQuery扩展
 * 从0开始写一个插件，希望后续有开发插件能力的同事继续完善下去
 *
 * @author: 张仕宗(zhangshizong@cnpc.com.cn)
 *
 * @update : 2020.04.16
 *
 * @version : 2.0.0
 */

(function($) {

    // plugin definition
    $.fn.drillTable = function(options) {

        //放弃全局变量定义的用法，避免一个页面引用两次插件数据冲突

        this.url = options.url ||'';
        this.method = options.method || "GET";
        this.dataOptions = [];
        this.datas = [];

        this.options = options || {};

        var _this = this;

        //遍历thread的所有tr，只取带有field的列
        var theads = $(this).find("tr");
        $(theads).each(function(index, trObject) {
            $(trObject).children().each(function(index, tdObject) {
                if(typeof($(tdObject).attr("field")) != "undefined") {
                    var ojbect = {};
                    ojbect.field = $(tdObject).attr("field");
                    ojbect.formatter = $(tdObject).attr("formatter");
                    _this.dataOptions.push(ojbect);
                }
            });
        });

        //请求数据
        $.ajax({
            url : this.url,
            method : this.method,
            success:function (response, index) {
                $.each(response, function(index, value) {
                    _this.datas.push(value);
                });

                var table = _this[0];

                var html = getHtml(_this.datas, _this.dataOptions, _this.options);
                $(html).appendTo(table);
            }
        });
    };

    // 计算table的html元素
    function getHtml(datas, dataOptions, options) {
        var html = "";

        //双重for循环变量属性和值
        $(datas).each(function(index, value){
            html += "<tr>";
            $(dataOptions).each(function (index1, value1) {

                if(value1.field === 'index') { //处理序号
                    html += "<td>" + formatter(index+1, null) +"</td>";
                } else if(options.hasOwnProperty(value1.formatter) && typeof options[value1.formatter] === 'function') { //处理回调函数
                    //调用回调函数，并返回值
                    var result = options[value1.formatter].call(this, value[value1.field], value, index);
                    html += "<td>" + result +"</td>";
                } else { //处理其他类型
                    html += "<td>" + formatter(value[value1.field], value1.formatter) +"</td>";
                }
            });
            html += "</tr>";
        });

        return html;
    };

    //格式化数据
    function formatter(value, formt) {

        if(undefined != formt && value != null) {
            switch(formt) {
                case 'number':
                    value = value.toFixed(2);
                    break;
                case 'daily-date':
                    '2020-01-01'
                    break;
                default:
                    value = value;
            }
        }
        return value;
    }

    //  ...
})(jQuery);
