#target indesign
#include functions.jsx

// logging
var logFilePath = "~/Desktop/appLog.txt";
var logFile = new File(logFilePath);

writeLog(logFile, "Log started at: " + currentDate.toString());
writeLog(logFile, "-------------------------------------");


// Suppress user interaction prompts
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;

// Get the folder
// var folderPath = Folder.selectDialog("Select the folder with cards in it");
var folderPath = Folder("/Icare%20Greetings/iCare%20Greetings/Cards");
// var PDFfolderPath = Folder.selectDialog("Select the folder where the pdf folders are...");
var PDFfolderPath = Folder("/Print%20Files/iCare%20Greetings/Single%20Card%20Orders/zz%20Scripted%20export%202");

const files = collectIndesignFiles(folderPath);
var totalFiles = files.length;
var progressBar = showProgressBar(totalFiles);

for (i = 0; i < files.length; i++) {
    try {
        // Attempt to open the file without showing a dialog
        var item = files[i];
        var doc = app.open(item, false);

        // getting the barcode file name, this is from old script. could probobly do it better.
        var sizeFolder = item.parent;
        var titleFolder = sizeFolder.parent;
        var titleContents = titleFolder.getFiles();

        writeLog(logFile, "Card: " + item.name);

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

        // do stuf here
        writeLog(logFile, "Doing this one.");

        expandEPS(doc, barcodeFileName);

        updateLink(doc, barcodeFileName);

        // log the path
        var destFile = new File(doc.filePath + "/" + doc.name);

        writeLog(logFile, destFile);

        // Export the PDF
        if (doc.name.indexOf("4x9") !== -1) {
            var PDFsizeFolder = "4x9"
        } else if (doc.name.indexOf("5x7") !== -1) {
            var PDFsizeFolder = "5x7"
        } else {
            var PDFsizeFolder = "square"
        }
        var PDFName = cleanFileName(doc.name);

        var exportPDFPath = new File(PDFfolderPath + "/" + PDFsizeFolder + "/" + PDFName + ".pdf");
        writeLog(logFile, exportPDFPath);

        var PDFPreset = app.pdfExportPreset.itemByName("Holmes Print Export")
        doc.exportFile(ExportFormat.PDF_TYPE, (new File(exportPDFPath)), false, PDFPreset);

        // Close the document without saving changes
        doc.close(SaveOptions.NO);

    } catch (e) {
        // If an error occurs, log the error message and continue to the next file
        writeLog(scriptLogFile, "Error opening file-> " + files[i].fsName + " - " + e.message);
    }

    // Update the progress bar
    progressBar.progressBar.value = i + 1; // Update to current file index
    progressBar.statusText.text = ("Processing: " + (i + 1) + " of " + totalFiles);
    progressBar.update(); // Refresh the UI


    // Allow for UI updates and user interaction
    if (progressBar.closeOnClick) {
        break; // Exit if the user closes the dialog
    }
}
// Close the progress bar window after processing is complete
progressBar.close();

// put prompts back
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;

alert("Done!");
