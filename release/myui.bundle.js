/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : null;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(9);
__webpack_require__(11);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * MyUI for jQuery
 *
 * Copyright (c) 2020 张翠山
 *
 * MIT License
 *
 * 联系作者：290794272@qq.com(张翠山)
 *
 * table组件 - MyUI for jQuery
 *
 * 版本：0.0.1
 */

(function ($) {

    // plugin definition
    $.fn.table = function (options) {

        //放弃全局变量定义的用法，避免一个页面引用两次插件数据冲突

        this.url = options.url || '';
        this.method = options.method || "GET";
        this.dataOptions = [];
        this.datas = [];

        this.options = options || {};

        var _this = this;

        //遍历thread的所有tr，只取带有field的列
        var theads = $(this).find("tr");
        $(theads).each(function (index, trObject) {
            $(trObject).children().each(function (index, tdObject) {
                if (typeof $(tdObject).attr("field") != "undefined") {
                    var ojbect = {};
                    ojbect.field = $(tdObject).attr("field");
                    ojbect.formatter = $(tdObject).attr("formatter");
                    _this.dataOptions.push(ojbect);
                }
            });
        });

        //请求数据
        $.ajax({
            url: this.url,
            method: this.method,
            success: function success(response, index) {
                $.each(response, function (index, value) {
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
        $(datas).each(function (index, value) {
            html += "<tr>";
            $(dataOptions).each(function (index1, value1) {

                if (value1.field === 'index') {
                    //处理序号
                    html += "<td>" + formatter(index + 1, null) + "</td>";
                } else if (options.hasOwnProperty(value1.formatter) && typeof options[value1.formatter] === 'function') {
                    //处理回调函数
                    //调用回调函数，并返回值
                    var result = options[value1.formatter].call(this, value[value1.field], value, index);
                    html += "<td>" + result + "</td>";
                } else {
                    //处理其他类型
                    html += "<td>" + formatter(value[value1.field], value1.formatter) + "</td>";
                }
            });
            html += "</tr>";
        });

        return html;
    };

    //格式化数据
    function formatter(value, formt) {

        if (undefined != formt && value != null) {
            switch (formt) {
                case 'number':
                    value = value.toFixed(2);
                    break;
                case 'daily-date':
                    '2020-01-01';
                    break;
                default:
                    value = value;
            }
        }
        return value;
    }

    //  ...
})(jQuery);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(0);
            var content = __webpack_require__(5);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(1);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "/**\r\n* myui-table表格定义样式\r\n*/\r\n@charset \"UTF-8\";\r\n\r\ncaption {\r\n\tcaption-side: top;\r\n\ttext-align:left;\r\n\tpadding: .5em;\r\n\tcolor: black;\r\n\tfont-weight: bold;\r\n\tfont-size: 15px;\r\n}\r\n.myui-table {\r\n\twidth: 99%;\r\n\tborder-collapse: collapse;\r\n\tmargin: 3px;\r\n\tfont-family: \"Trebuchet MS\", Arial, Helvetica, sans-serif;\r\n}\r\n\r\n.myui-table td, .myui-table th {\r\n\tfont-size: 1em;\r\n\tborder: 2px solid rgba(255, 255, 255, 1);\r\n\tpadding: 3px 3px 2px 3px;\r\n\ttext-align: center;\r\n}\r\n\r\n.myui-table th {\r\n\theight: 45px;\r\n\tfont-size: 1.1em;\r\n\tpadding-top: 5px;\r\n\tpadding-bottom: 4px;\r\n\tbackground-color: #4fa6db;\r\n\tcolor: #ffffff;\r\n}\r\n\r\n.myui-table tbody tr:nth-child(even) td {\r\n\tbackground-color:#f9f9f9;\r\n\theight: 28px;\r\n}\r\n\r\n.myui-table tbody tr:nth-child(odd) td {\r\n\tbackground-color:#eeeeee;\r\n\theight: 28px;\r\n}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

(function ($) {

    // plugin definition
    $.fn.tabs = function (options) {

        var _this = this;

        $(this).children('input').click(function () {

            var activeIndex = $(this).index();

            $(_this).children("input").each(function (index, element) {
                if (activeIndex != index) {
                    $(this).removeClass("active");
                } else if (activeIndex == index) {
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

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(0);
            var content = __webpack_require__(8);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(1);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "/**\r\n* myui-tabs页签样式定义\r\n*/\r\n@charset \"UTF-8\";\r\n\r\n.myui-tabs div {\r\n    width: 200px;\r\n    height: 200px;\r\n    display: none;\r\n}\r\n\r\n.myui-tabs .active {\r\n    background: white;\r\n}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(0);
            var content = __webpack_require__(10);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(1);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".progressbar {\r\n    border-width: 1px;\r\n    border-style: solid;\r\n    -moz-border-radius: 5px 5px 5px 5px;\r\n    -webkit-border-radius: 5px 5px 5px 5px;\r\n    border-radius: 5px 5px 5px 5px;\r\n    overflow: hidden;\r\n    position: relative;\r\n}\r\n.progressbar-text {\r\n    text-align: center;\r\n    position: absolute;\r\n}\r\n.progressbar-value {\r\n    position: relative;\r\n    overflow: hidden;\r\n    width: 0;\r\n    -moz-border-radius: 5px 0 0 5px;\r\n    -webkit-border-radius: 5px 0 0 5px;\r\n    border-radius: 5px 0 0 5px;\r\n}\r\n.progressbar {\r\n    border-color: #95B8E7;\r\n}\r\n.progressbar-text {\r\n    color: #000000;\r\n    font-size: 14px;\r\n}\r\n.progressbar-value,\r\n.progressbar-value .progressbar-text {\r\n    background-color: #ffe48d;\r\n    color: #000000;\r\n}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
        $(target).html('<div class="progressbar-text" "></div>' + '<div class="progressbar-value">' + '<div class="progressbar-text"></div>' + '</div>');

        return $(target);
    }

    //设置size函数
    function setSize(target, width) {

        var opts = $.data(target, 'progress').options;
        var bar = $.data(target, 'progress').bar;
        if (width) {
            opts.width = width;
        }

        bar.width(opts.width);
        bar.find('div.progressbar-text').css('width', opts.width);
        bar.find('div.progressbar-text,div.progressbar-value').css({
            height: opts.height + 'px',
            lineHeight: opts.lineHeight + 'px'
        });
    }

    //插件入口
    $.fn.progress = function (options, params) {

        if (typeof options == 'string') {
            var fn = $.fn.progress.methods[options]; //获取方法
            if (fn) {
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
    };

    //原型链上的属性
    $.fn.progress.methods = {
        options: function options(jq) {
            return $.data(jq[0], 'progress').options;
        },
        setValue: function setValue(jq, value) {

            return $(jq).each(function () {
                var opts = $.data(this, 'progress').options;
                var text = opts.text.replace(/{value}/, value);

                $(this).find('div.progressbar-value').width(value + '%');
                $(this).find('div.progressbar-text').html(text);

                var oldValue = opts.value;
                if (oldValue != value) {
                    //如果新值不等于旧的值，触发回调函数
                    opts.onChange(value, oldValue);
                    opts.value = value;
                    // opts.onChange.call(this, value, oldValue);
                }
            });
        },
        getValue: function getValue(jq) {
            return $.data(jq[0], 'progress').options.value;
        },
        resize: function resize(jq, width) {
            return jq.each(function () {
                setSize(this, width);
            });
        },
        start: function start(jq, speed) {
            speed = speed || 100;
            if (typeof speed == 'string') {
                if ('fast' == speed) {
                    speed = 50;
                } else if ('normal' == speed) {
                    speed = 100;
                } else if ('slow' == speed) {
                    speed = 200;
                } else {
                    speed = 100;
                }
            }

            window.clearInterval(handler); //每次触发都先清除一次
            var value = 0;
            function run() {
                if (value >= 100) {
                    value = 0;
                }
                value++;
                $.fn.progress.methods.setValue(jq, value);
                value = $.fn.progress.methods.getValue(jq);
            }
            handler = window.setInterval(run, speed);
        },
        stop: function stop(jq) {
            window.clearInterval(handler);
        }
    };

    //插件默认值
    $.fn.progress.defaults = {
        width: 'auto',
        height: 22,
        value: 0, // percentage value
        text: '{value}%',
        onChange: function onChange(oldValue, newValue) {//空实现的回调函数
        }
    };
})(jQuery);

/***/ })
/******/ ]);