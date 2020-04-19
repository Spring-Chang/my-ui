/**
 * MyUI for jQuery
 *
 * Copyright (c) 2020 张翠山
 *
 * MIT License
 *
 * 联系作者：290794272@qq.com(张翠山)
 *
 * tabs组件 - MyUI for jQuery
 *
 * 版本：0.0.1
 */

(function($) {

    // plugin definition
    $.fn.tabs = function(options) {

        var _this = this;

        $(this).children('input').click(function () {

            var activeIndex = $(this).index();

            $(_this).children("input").each(function (index, element) {
                if(activeIndex != index) {
                    $(this).removeClass("active");
                } else if(activeIndex == index) {
                    $(this).addClass("active");
                }
            });

            $(_this).children("div").each(function (index, element) {
                if (activeIndex != index) {
                    $(this).hide();
                } else if (activeIndex == index) {
                    $(this).show();
                }
            });
        });
    };

})(jQuery);
