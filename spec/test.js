var TextToJson = require('../lib/textToJson.js');

describe('textToJson', function(){

    it('Simple text', function(){
        expect(TextToJson('text')).toBe(['text']);
    });

    it('break line', function(){

        var testInput =  "Lorem Ipsum." + "\n"+
            "It is a long." + "\n"+
            "There are many variations.";

        expect(TextToJson(testInput))
            .toBe(
            [
                'Lorem Ipsum.',
                'It is a long.',
                'There are many variations.'
            ]
        );
    });

});


