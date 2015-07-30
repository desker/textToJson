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
  },

  mentions: function() {
    var regexp = /@id(g?)([\d]+)\(([\S\s]+?)\)/g;

//    var res = ">Lorem @id1234(Сергей Иванов), @idg1234(Наименование группы).\n".match(regexp);
    
    for (var i=0; i<this.lines.length; i++) {
      var line = this.lines[i],
          result = [];

      line.map(function(item, n) {
        if (!isString(item)) {
          result.push(item);
          return;
        }

        var found = [],
            str = item,
            res;
        while ((res = regexp.exec(item)) != null) {
          found.push(res);
        }

        if (found.length===0) {
          result.push(item);
          return;
        }

        for (var j = 0; j < found.length; j++) {
          var arr = str.split(found[j][0]);
          result.push(arr[0]);
          var mention = {
            tag: 'mention',
            value: found[j][3],
            id: found[j][2]
          };

          if (found[j][1]==='g') mention.isGroup = true;

          result.push(mention);
          str = arr[1];
        };
        result.push(str);
      });
      this.lines[i] = result;
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

  parse.mentions();

  if (smiles) {
    parse.smiles(smiles);
  }

  parse.line();

  return parse.lines;
};
