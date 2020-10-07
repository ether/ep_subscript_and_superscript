describe("Set Superscript and subscript and ensure its removed properly", function(){

  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb);
    this.timeout(60000);
  });

  it("When Superscript is changed", function(done) {
    this.timeout(60000);
    var chrome$ = helper.padChrome$;
    var inner$ = helper.padInner$;

    var $firstTextElement = inner$("div").first();
    var $editorContainer = chrome$("#editorcontainer");

    var $editorContents = inner$("div")
    $firstTextElement.sendkeys('First Line!');
    $firstTextElement.sendkeys('{selectall}');

    // sets first line to h1
    chrome$('.buttonicon-superscript').click();
    helper.waitFor(function(){
      let $firstSpan = inner$("div").first().find("span");
      return $firstSpan.hasClass("sup");
    }).done(function(){
      done();
    });

  });

  it("When Subscript is changed", function(done) {
    this.timeout(60000);
    var chrome$ = helper.padChrome$;
    var inner$ = helper.padInner$;

    var $firstTextElement = inner$("div").first();
    var $editorContainer = chrome$("#editorcontainer");

    var $editorContents = inner$("div")
    $firstTextElement.sendkeys('First Line!');
    $firstTextElement.sendkeys('{selectall}');

    // sets first line to h1
    chrome$('.buttonicon-subscript').click();
    helper.waitFor(function(){
      let $firstSpan = inner$("div").first().find("span");
      return $firstSpan.hasClass("sub");
    }).done(function(){
      done();
    });

  });


});

