!function(t,e){"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?module.exports=e():t.TextToJson=e()}(this,function(){"use strict";function t(t){var e=t.split("\n"),o=[],n=!1;return e.map(function(t,e){var u=o[o.length-1];return""===t?void(n||(o.push({tag:"br"}),n=!0)):(n=!1,"..."===t?void o.push({tag:"hr"}):">"===t[0]?(t=t.substr(1),void("object"==typeof u&&"blockquote"===u.tag?u.value.push(t):o.push({tag:"blockquote",value:[t]}))):void o.push(t))}),console.dir(o),o}return t});