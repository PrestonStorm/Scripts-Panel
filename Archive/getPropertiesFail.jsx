// Function to create a dialog for displaying properties
function createPropertiesDialog(target) {
    // Create a new dialog window
    var dialog = new Window("dialog", target, undefined, { resizeable: true });
    dialog.preferredSize.width = 500; // Set width of the dialog
    dialog.preferredSize.height = 400; // Set height of the dialog

    // Add a static text label
    dialog.add("statictext", undefined, "Select a property to view its details:");

    // Create a ListBox to hold document properties
    var myListBox = dialog.add("listbox", undefined, [], { multiselect: false });
    myListBox.preferredSize.height = 200; // Set height of the ListBox
    myListBox.minimumSize.width = 480; // Set minimum width of the ListBox

    // Create a static text field to display property details
    var detailTextField = dialog.add("edittext", undefined, "", { multiline: true });
    detailTextField.preferredSize.height = 150; // Set height of the text field
    detailTextField.minimumSize.width = 480; // Set minimum width of the text field
    detailTextField.enabled = false; // Make it non-editable but selectable

    // Collect properties of the target (document or selected object)
    for (var property in target) {
        try {
            myListBox.add("item", property); // Add property name to ListBox
        } catch (_) {
            // Handle any errors silently
        }
    }

    // Add an event listener for selection change
    myListBox.onChange = function() {
        var selectedItem = myListBox.selection;
        if (selectedItem) {
            var propertyName = selectedItem.text;
            var propertyValue;
            try {
                propertyValue = target[propertyName]; // Get value of the selected property
                detailTextField.text = propertyName + ": " + propertyValue; // Display in text field
            } catch (_) {
                detailTextField.text = propertyName + ": failed to get value"; // Display error message
            }
        }
    };

    // Add a button to open properties of the selected object
    var objectButton = dialog.add("button", undefined, "Show Selected Object Properties");
    
    objectButton.onClick = function() {
        if (myListBox.selection > 0) {
            var selectedObject = myListBox.selection
            var objectDialog = createPropertiesDialog(selectedObject); // Create a new dialog for the selected object
            objectDialog.show(); // Show the new dialog
        } else {
            alert("No object selected. Please select an object and try again.");
        }
    };

    return dialog;
}

// Main function to create the initial dialog for document properties
function main() {
    var targetDocument = "app.activeDocument";

    // Create and show the document properties dialog
    var docDialog = createPropertiesDialog(targetDocument);


    docDialog.show(); // Show the initial document properties dialog
}

// Run the main function
main();