const fs = require('fs');
const path = require('path');

// Define the directory to scan
const directoryPath = path.join(__dirname, '../resources/flags'); // Adjust this path as needed

// Function to replace any width and height values with "full"
function replaceDimensionsInFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${filePath}`, err);
            return;
        }

        // Regular expression to match width or height with any value and replace it with "full"
        const newData = data.replace(/(width|height)="[^"]*"/g, '$1="full"');

        if (newData !== data) {
            fs.writeFile(filePath, newData, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing file: ${filePath}`, err);
                } else {
                    console.log(`Updated dimensions in ${filePath}`);
                }
            });
        }
    });
}

// Function to recursively scan the directory
function scanDirectory(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Unable to scan directory: ${err.message}`);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(directory, file);

            // Check if it's a file or directory
            fs.stat(filePath, (err, stat) => {
                if (err) {
                    console.error(`Unable to stat file: ${err.message}`);
                    return;
                }

                if (stat.isFile()) {
                    replaceDimensionsInFile(filePath);
                } else if (stat.isDirectory()) {
                    scanDirectory(filePath); // Recursively scan subdirectories
                }
            });
        });
    });
}

// Start the process
scanDirectory(directoryPath);
