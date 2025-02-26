//HelloWorld.idjs
//An InDesign UXPScript
//
//Creates a new document, adds a text frame,
//resizes the text frame and adds text.
var myDocument = app.documents.add();
var myTextFrame = myDocument.pages.item(0).textFrames.add();
/*Set the geometric bounds (the location of the top, left, bottom, and right edges) of the text frame. In this step, the script uses measurement overrides ("p" for picas) to ensure the text frame is the correct size, regardless of your default measurement units. The locations are provided as a list, or array, of values; each scripting language has a slightly different way of creating an array. */
 myTextFrame.geometricBounds = ["6p", "6p", "24p", "24p"];
//Add text to the text frame by setting the proporty of the content to a string myTextFrame.contents = "Hello World!";