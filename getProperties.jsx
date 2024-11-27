var target = app.activeDocument.textFrames[0];
var file = new File(new File($.fileName).path + "/property.txt");
file.open("w");
for (var property in target) {
    try {
        file.writeln(property + ": " + target[property]);
    } catch (_) {
        file.writeln(property + ": failed to get value");
    }
}
file.close();
// alert("file output");