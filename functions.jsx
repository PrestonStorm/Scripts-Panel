function logFontStatus (doc, logFile) {
    logFile.writeln("=== Font status ===");

    var fonts = doc.fonts
    for (var i = 0; i < fonts.length; i++) {
        var font = fonts[i];

        writeLog(logFile, '"' + doc.name + '"' + "," + '"' + font.name + '"' + "," + '"' + font.status + '"')
    }
}

function logLinkStatus (doc, logFile) {
    logFile.writeln("=== Link status ===");

    var links = doc.links;
    for (var i = 0; i < links.length; i++) {
        var link = links[i];

        writeLog(logFile, '"' + doc.name + '"' + "," + '"' + doc.filePath + '"' + "," + '"' + link.name + '"' + "," + '"' + link.filePath + '"' + "," + '"' + link.status + '"')
    }
}

function collectIndesignFiles(item) {
    const files = [];
    function get(item) {
        if (item instanceof Folder) {
            var subItems = item.getFiles();
            for (var i = 0; i < subItems.length; i++) {
                get(subItems[i]);
            }
        } else if (item instanceof File && item.name.match(/\.indd$/) && ! item.name.match(/^._/i)) {
            files.push(item);
        }
    };
    get(item);
    return files;
}

function writeLog(logFile, line) {
    logFile.open("a");
    logFile.writeln(line);
    logFile.close();
}

function showProgressBar(totalFiles) {
    var progressBar = new Window("palette", "Processing Files");
    progressBar.progressBar = progressBar.add("progressbar", [12, 12, 300, 32], 0, totalFiles);
    progressBar.progressBar.preferredSize.width = 400;
    progressBar.statusText = progressBar.add("statictext", undefined, "Processing all of your files!!");
    progressBar.show();
    return progressBar;
}

function debug(target) {
    var file = new File("~/Desktop/prop.txt");
    file.open("w");
    for (var property in target) {
        try {
            file.writeln(property + ": " + target[property]);
        } catch (_) {
            file.writeln(property + ": failed to get value");
        }
    }
    file.close();
}

// Holmes printing functions

function updateLink(barcodeFileName) {
    var doc = app.activeDocument;
    var barcode = doc.links.item(barcodeFileName);
    var link = barcode.parent.itemLink;
    debug(link)
    link.update();
}

function expandEPS(barcodeFileName) {
    // set active doc
    var item = app.activeDocument;

    // Get the barcode object
    var barcode = item.links.item(barcodeFileName);
    // debug(barcode)
    // Get the eps of the barcode
    var barcodeEPS = barcode.parent;
    // debug(barcodeEPS.itemLink)
    // im not sure what this is...
    var epsParent = barcodeEPS.parent;
    var swatch = app.activeDocument.swatches[2];
    
    // do stuff to the visible bounds
    var new1 = (epsParent.visibleBounds[0] - (0.09))
    var new2 = (epsParent.visibleBounds[1] - (0.07))
    var new3 = (epsParent.visibleBounds[2] + (0.17))
    var new4 = (epsParent.visibleBounds[3] + (0.07))
    
    epsParent.strokeWeight = 2;
    epsParent.visibleBounds = [new1, new2, new3, new4];
    epsParent.fillColor = swatch;
    epsParent.strokeColor = swatch;
    // barcodeEPS.itemLink.update()

    // debug(barcodeEPS);
}

function cleanFileName(fileName) {
    // Remove leading numbers and spaces
    var cleanName = fileName.replace(/^[\d\s]+/, '');
    
    // Remove file extension (assuming it's always .indd)
    cleanName = cleanName.replace(/\.indd$/i, '');
    
    return cleanName;
}