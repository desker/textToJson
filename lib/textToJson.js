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

function Parser(text) {
  this.init(text);
}

Parser.prototype = {
  init: function(text) {
    this.lines = text.split("\n").map(function(item) { return [ item ]; });

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

  smiles: function(list) {
    for (var j = 0; j < list.length; j++) {
      var smile = list[j];

      for (var i=0; i<this.lines.length; i++) {
        var line = this.lines[i],
            result = [];

        line.map(function(item) {
          if (!isString(item)) {
            result.push(item);
            return;
          }

          item = item.split(smile);

          item.map(function(str, n) {
            if (str!=='') result.push(str);
            if (n!==item.length-1) result.push({ tag: 'smile', value: smile });
          });
        });

        this.lines[i] = result;
      }
    }
    console.log(this.lines);
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

    this.lines = result;
  }
};

function TextToJson(text, smiles) {
  var parse = new Parser(text);
  parse.tag('b', /\*\*([\S\s]+?)\*\*/g, '**');
  parse.tag('i', /\*([\S\s]+?)\*/g, '*');
  parse.tag('hash', /\#([\S][^.,]+)/g, '#');

  if (smiles) {
    parse.smiles(smiles);
  }

  parse.line();

  return parse.lines;
};

return TextToJson;
}));
