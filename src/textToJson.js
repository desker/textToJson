'use strict';

function isObject(val) {
  return typeof(val)==='object';
}

function isArray(val) {
  return Array.isArray(val);
}

function parseBold(line) {
  var regexp = /\*\*([\S\s]+?)\*\*/g,
      splitter = '**',
      prefix = 'b|',
      arr = line.replace(regexp, splitter+prefix+'$1'+splitter).split(splitter),
      result = [];

  arr.map(function(item, i) {
    if (item==='') return;
    if (item.substr(0,2)===prefix) {
      item = item.substr(2);
      result.push({ tag: 'b', value: item });
      return;
    }

    result.push(item);
  });

  return result;
}

function parseItalic(line) {
  var regexp = /\*([\S\s]+?)\*/g,
      splitter = '*',
      prefix = 'i|',
      arr = line.replace(regexp, splitter+prefix+'$1'+splitter).split(splitter),
      result = [];

  arr.map(function(item, i) {
    if (item==='') return;
    if (item.substr(0,2)===prefix) {
      item = item.substr(2);
      result.push({ tag: 'i', value: item });
      return;
    }

    result.push(item);
  });

  return result;
}

function parseLine(line) {
  var arr = parseBold(line),
      result = [];

  if (isArray(arr)) {
    arr.map(function(item, i) {
      if (isObject(item)) {
        result.push(item);
        return;
      }
      var str = parseItalic(item);
      
      if (isArray(str)) {
        for (var i = 0; i < str.length; i++) {
          result.push(str[i]);
        }
      } else {
        result.push(str);
      }
    });
  }

  return result;
}

function TextToJson(text) {
  var lines = text.split("\n"),
      lines2 = [];

  lines.map(function(line, i) {
    var lastInsert = lines2[lines2.length-1];

    if (line==='') {
      if (!isObject(lastInsert) || lastInsert.tag!=='br') {
        lines2.push({ tag: 'br' });
      
}      return;
    }

    if (line==='...') {
      lines2.push({ tag: 'hr' });
      return;
    }


    if (line[0]==='>') {
      line = parseLine(line.substr(1));
      if (isObject(lastInsert) && lastInsert.tag==='blockquote') {
        lastInsert.value.push(line);
      } else {
        lines2.push({ tag: 'blockquote', value: [line] });
      }
      return;
    }

    line = parseLine(line);
    lines2.push(line);

  });

  lines2.map(function(item, i) {
    if (isObject(item) && item.tag==='blockquote') {
      if (isArray(item.value)) {
        if (item.value.length===1) {
          item.value = item.value[0];
          lines2[i] = item;
        } else {
          item.value.map(function(str, i) {
            if (isArray(str) && str.length===1) {
              item.value[i] = str[0];
            }
          });
        }
      }
    }
  });

  //console.dir(lines2);
  document.write(JSON.stringify(lines2));

  return lines2;

}