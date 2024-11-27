#target indesign
#include functions.jsx

var logFilePath = "~/Desktop/appLog.txt";
var logFile = new File(logFilePath);

// Get the folder
// var folderPath = Folder.selectDialog("Select the folder with cards in it");
var folderPath = Folder("/Icare%20Greetings/iCare%20Greetings/Cards");
// var PDFfolderPath = Folder.selectDialog("Select the folder where the pdf folders are...");
var PDFfolderPath = Folder("/Print%20Files/iCare%20Greetings/Single%20Card%20Orders/zz%20Scripted%20export%202");

if (logFile.open("a")) {
    // Write a header with timestamp
    var currentDate = new Date();
    logFile.writeln("Log started at: " + currentDate.toString());
    logFile.writeln("-------------------------------------");
    
    // var doc = app.activeDocument;

    // debug(doc.parent);

    // var barcodeFileName = "649910090215_5x7.eps";

    // logFile.writeln(barcodeFileName);

    // expandEPS (barcodeFileName);
    function searchForINDDFiles(folder) {
        // Get an array of File and Folder objects in the current folder
        var contents = folder.getFiles();

        // Loop through each item in the folder
        for (var i = 0; i < contents.length; i++) {
            var item = contents[i];

            // Check if it's a file with .indd extension
            // there seem to be some files with ._ in it, ignoring...
            if (item instanceof File && item.name.match(/\.indd$/i) && ! item.name.match(/^._/i)) {
                var sizeFolder = item.parent;
                var titleFolder = sizeFolder.parent;
                var titleContents = titleFolder.getFiles();

                logFile.writeln("Card: " + item.name)

                // get the Design Elements folder
                for (var x = 0; x < titleContents.length; x++) {
                    stuff = titleContents[x];

                    if (stuff instanceof Folder && stuff.name === "Design%20Elements") {
                        var designElements = stuff.getFiles();
                        for (var z = 0; z < designElements.length; z++) {
                            var designElement = designElements[z];
                            var size = sizeFolder.name;
                            if (designElement.name.match(/\.eps$/i) && designElement.name.match(new RegExp(size, 'i')) && ! designElement.name.match(/^._/i)) {
                                barcodeFileName = designElement.name;
                            }
                        }
                    }
                }


                // Access the application's linking preferences
                // var linkingPrefs = app.linkingPreferences;

                // // Set the desired linking preferences
                // linkingPrefs.checkLinksAtOpen = true;
                // linkingPrefs.updateLinkWhileSaving = true;
                // app.linkedPageItemOptions.warnOnUpdateOfEditedPageItem = true;
                // linkingPrefs.updateLinksWhileOpening = false;
                // app.linkedPageItemOptions.updateLinkWhileSaving = true;
                // debug(app)

                // var item = File.openDialog("open a file");

                if (item != null) {

                    var DebuglogFilePath = "~/Desktop/appLog.txt";
                    var DebuglogFile = new File(DebuglogFilePath);
                    DebuglogFile.open();
                    var fileContents = DebuglogFile.read();
                    DebuglogFile.close();

                    if (fileContents.indexOf(item) !== -1) {

                        logFile.writeln("Skipped this one.");

                    } else {

                        app.open(item);

                        var doc = app.activeDocument;

                        logFile.writeln("Doing this one.");

                        expandEPS(barcodeFileName);
    
                        updateLink(barcodeFileName);
    
                        // vars
                        
                        // log the path
                        var destFile = new File(doc.filePath + "/" + doc.name);
                        logFile.writeln(destFile);
    
                        // Export the PDF
                        if (doc.name.indexOf("4x9") !== -1) {
                            var PDFsizeFolder = "4x9"
                        } else if (doc.name.indexOf("5x7")) {
                            var PDFsizeFolder = "5x7"
                        } else {
                            var PDFsizeFolder = "square"
                        }
                        var PDFName = cleanFileName(doc.name);
    
                        var exportPDFPath = new File(PDFfolderPath + "/" + PDFsizeFolder + "/" + PDFName + ".pdf")
                        logFile.writeln(exportPDFPath);
    
    
                        doc.exportFile(ExportFormat.PDF_TYPE, (new File(exportPDFPath)), false, app.pdfExportPresets[6]);
    
                        app.activeDocument.save(destFile);
                        
                        doc.close();
                    }

                } else {
                    alert("No file selected");
                }
            }
            // Check if it's a folder and recursively search it
            else if (item instanceof Folder) {
                searchForINDDFiles(item);
            }
        }
    }

    // Create a Folder object for the root folder
    var rootFolder = new Folder(folderPath);

    // Check if the root folder exists
    if (rootFolder.exists) {
        // Start recursive search for .indd files
        searchForINDDFiles(rootFolder);
    } else {
        // Handle case where root folder doesn't exist
        logFile.writeln("Root folder not found: " + folderPath);
    }

    // Close the log file
    logFile.close();
} else {
    // Handle case where log file couldn't be opened
    alert("Error: Unable to open log file for writing.");
}