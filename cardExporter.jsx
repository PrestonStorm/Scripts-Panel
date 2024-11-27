#target indesign
#include functions.jsx

var logFilePath = "~/Desktop/appLog.txt";
var logFile = new File(logFilePath);

// Get the folder
// var folderPath = Folder.selectDialog("Select the folder with cards in it");
var folderPath = Folder("/Icare%20Greetings/iCare%20Greetings/Cards");
// var PDFfolderPath = Folder.selectDialog("Select the folder where the pdf folders are...");
var PDFfolderPath = Folder("/Print%20Files/iCare%20Greetings/Single%20Card%20Orders/zz%20Scripted%20export%202");

writeLog(logFile, "Log started at: " + currentDate.toString());
writeLog(logFile, "-------------------------------------");

