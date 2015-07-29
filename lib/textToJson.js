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

function isObject(val) {
  return typeof(val)==='object';
}

function isString(val) {
  return typeof(val)==='string';
}

function isArray(val) {
  return Array.isArray(val);
}

function Parser(text, smiles) {
  this.smiles = smiles;
  this.init(text);
}

Parser.prototype = {
  init: function(text) {
    this.lines = text.split("\n").map(function(item) { return [ item ]; });
    this.tag('b', /\*\*([\S\s]+?)\*\*/g, '**');
    this.tag('i', /\*([\S\s]+?)\*/g, '*');
    this.tag('hash', /\#([\S][^.,]+)/g, '#');

    this.line();
    //this.tag('smile', new RegExp("(["+this.smiles.join('|')+"])"), "g");
  },

  tag: function(tag, regexp, splitter) {
    var prefix = tag[0]+'|',
        self = this;

    for (var i=0; i<this.lines.length; i++) {
      var line = this.lines[i],
          result = [];

      line.map(function(item, n) {
        if (!isString(item)) {
          result.push(item);
          return;
        }

        var arr = item.replace(regexp, splitter+prefix+'$1'+splitter).split(splitter);
        arr.map(function(str) {
          if (str==='' || str===' ') return;
          if (str.substr(0,2)===prefix) {
            str = str.substr(2);
            result.push({ tag: tag, value: str });
            return;
          }

          result.push(str);
        });
        
        self.lines[i] = result;
      });
    }
  },

  line: function() {
    var result = [],
        self = this;

    this.lines.map(function(line, i) {
      var lastInsert = result[result.length-1];

      if (line.length===1 && isString(line[0])) {
        line = line[0];
      }

      if (line==='...') {
        result.push({ tag: 'hr' });
        return;
      }

      if (line.length>0 && (line[0]==='>' || (line[0][0] && line[0][0]==='>'))) {
        if (isString(line)) line = line.substr(1);
        else line[0] = line[0].substr(1);
        console.log(lastInsert);
        if (isObject(lastInsert) && lastInsert.tag==='blockquote') {
          result[result.length-1].value.push(line);
        } else {
          result.push({ tag: 'blockquote', value: [line] });
        }
        return;
      }

      if (line.length===0) {
        if ((isObject(lastInsert) && lastInsert.tag==='br') || i===self.lines.length-1)
          return;

        result.push({ tag: 'br' });
        return;
      }

      result.push(line);
    });

    console.log(result);
    this.lines = result;
  }
};

function TextToJson(text) {
  var parse = new Parser(text);
  console.dir(parse.lines);

  return parse.lines;
};

return TextToJson;
}));
