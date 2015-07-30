var TextToJson = require('../lib/textToJson.js');

describe('textToJson', function(){

    it('Simple text', function(){
        expect(TextToJson('text')).toEqual(['text']);
    });

    it('Break line', function(){

        var testInput =  "Lorem Ipsum." + "\n"+
            "It is a long." + "\n"+
            "There are many variations.";

        expect(TextToJson(testInput))
            .toEqual(
            [
                'Lorem Ipsum.',
                'It is a long.',
                'There are many variations.'
            ]
        );
    });

    it('Tag br', function() {
        var testInput = 'Lorem Ipsum is simply dummy text of the printing.\n\n\n\n'+
        'Lorem Ipsum is simply dummy text of the printing.\n\n';

        expect(TextToJson(testInput))
            .toEqual(
                 [
                    "Lorem Ipsum is simply dummy text of the printing.",
                    {"tag":"br"},
                    "Lorem Ipsum is simply dummy text of the printing." , 
                    {"tag":"br"}
                 ]
            );
    });

    it('Tag hr', function() {
      var testInput = 'Lorem Ipsum is simply dummy text of the printing.\n...\nLorem Ipsum is simply dummy text of the printing.';

      expect(TextToJson(testInput))
        .toEqual(
          [
            "Lorem Ipsum is simply dummy text of the printing.",
            {"tag":"hr"},
            "Lorem Ipsum is simply dummy text of the printing."
          ]
        );
    });

    it('Blockquote', function() {
      var testInput = '>Lorem Ipsum is simply dummy text of the printing.\n'+
        '>Lorem Ipsum is simply dummy text of the printing.\n'+
        'There are many variations of passages of Lorem Ipsum available.\n'+
        '>Lorem Ipsum is simply dummy text of the printing.\n';

      expect(TextToJson(testInput))
        .toEqual(
            [
              {
              "tag":"blockquote", 
              "value":[
                "Lorem Ipsum is simply dummy text of the printing.",
                "Lorem Ipsum is simply dummy text of the printing."
              ]},
              "There are many variations of passages of Lorem Ipsum available.",
              {
              "tag":"blockquote", 
              "value":[
                "Lorem Ipsum is simply dummy text of the printing."
              ]},
           ]
          );
    });

    it('Bold and italic', function() {

      var testInput = '>Lorem *Ipsum is simply* dummy text of the printing.\n'+
          '>Lorem **Ipsum is simply** dummy text of the printing.\n';

      expect(TextToJson(testInput))
        .toEqual(
            [
              {
              "tag":"blockquote", 
              "value":[
                ["Lorem ", {"tag":"i", "value": "Ipsum is simply"}, " dummy text of the printing."],
                ["Lorem ", {"tag":"b", "value": "Ipsum is simply"}, " dummy text of the printing."],
              ]}
           ]
          );

    });

    it('Hash tag', function() {
      expect(TextToJson('Lorem #Ipsum, #Photo.\n'))
        .toEqual( [
    ["Lorem ", {"tag":"hash", "value": "Ipsum"}, ", " , {"tag":"hash", "value": "Photo"} , "." ]
 ]);
    });

    it("Smiles", function() {
      expect(TextToJson('Lorem :name_of_smile: dummy text of the printing.\n', [":name_of_smile:", ":)" ,";)"]))
        .toEqual([
    ["Lorem ", {"tag":"smile", "value": ":name_of_smile:"}, " dummy text of the printing."]
 ]);

    });

});


