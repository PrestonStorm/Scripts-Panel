#include functions.jsx

// Create log file for script links and fonts
const scriptLogFilePath = "~/Desktop/mylog.txt";
const linksLogFilePath = "~/Desktop/linksLog.csv";
const fontsLogFilePath = "~/Desktop/fontsLog.csv";
const scriptLogFile = new File(scriptLogFilePath);
const linksLogFile = new File(linksLogFilePath);
const fontsLogFile = new File(fontsLogFilePath);
// Start logging
var currentDate = new Date();
// Logging Date
writeLog(scriptLogFile, "Log started at-> " + currentDate.toString());
writeLog(scriptLogFile, "-------------------------------------");
writeLog(linksLogFile, "Log started at-> " + currentDate.toString());
writeLog(linksLogFile, "-------------------------------------");
writeLog(linksLogFile, "Document Name , Document Path , Link Name , File Path , Status");
writeLog(fontsLogFile, "Log started at-> " + currentDate.toString());
writeLog(fontsLogFile, "-------------------------------------");
writeLog(fontsLogFile, "Document Name , Font Name , Status");
// Suppress user interaction prompts
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
// Select start folder
const folderPath = Folder.selectDialog("Select a folder");
// var items = folderPath.getFiles();
const files = collectIndesignFiles(folderPath);
// start.collectIndesignFiles(folderPath);
// Amount of files
var totalFiles = files.length;
var progressBar = showProgressBar(totalFiles);
for (i = 0; i < files.length; i++) {
    try {
        // Attempt to open the file without showing a dialog
        var doc = app.open(files[i], false);

        // Log the file name
        writeLog(scriptLogFile, "File Name-> " + doc.name);

        // Log font status
        logFontStatus(doc, fontsLogFile);

        // Log link status
        logLinkStatus(doc, linksLogFile);

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
// Open the InDesign document without showing any dialog
// put prompts back
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
alert("Done!");
