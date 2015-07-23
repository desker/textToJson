;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.TextToJson = factory();
  }
}(this, function() {
'use strict';

function TextToJson(text) {
  var lines = text.split("\n"),
      lines2 = [],
      isEmptyLine = false;

  lines.map(function(line, i) {
    var lastInsert = lines2[lines2.length-1];

    if (line==='') {
      if (!isEmptyLine) {
        lines2.push({ tag: 'br' });
        isEmptyLine = true;
      }
      return;
    }

    isEmptyLine = false;

    if (line==='...') {
      lines2.push({ tag: 'hr' });
      return;
    }

    if (line[0]==='>') {
      line = line.substr(1);
      if (typeof(lastInsert)==='object' && lastInsert.tag==='blockquote') {
        lastInsert.value.push(line);
      } else {
        lines2.push({ tag: 'blockquote', value: [line] });
      }
      return;
    }

    lines2.push(line);

  });

  console.dir(lines2);

  return lines2;

}
return TextToJson;
}));
