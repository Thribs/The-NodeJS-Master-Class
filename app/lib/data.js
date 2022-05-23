/**
 * Library for storing and editing data
 *
 */

// Dependencies
const fs = require("fs");
const path = require("path");
const helpers = require("./helpers")

// Container for the module

const lib = {};

// Define the base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// White data to a file
lib.create = (dir, file, data, callback) => {
  // Open the file for writing
  const filePath = path.join(lib.baseDir, dir, file + ".json");
  fs.open(filePath, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);

      // White to file and close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback(`Error closing new file: ${err.message}`);
            }
          });
        } else {
          callback(`Error writing to new file: ${err.message}`);
        }
      });
    } else {
      callback(
        `Could not create file. It may already exist ${err}; file descriptor: ${fileDescriptor}`
      );
    }
  });
};

// Read data from a file descriptor
lib.read = (dir, file, callback) => {
  console.log(lib.baseDir);
  //   const filePath = path.join(lib.baseDir, dir, file + ".json");
  const filePath = path.join(lib.baseDir, dir, file + ".json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (!err && data) {
      const parsedData = helpers.parseJsonToObject(data);
      callback(false, parsedData);
    }
    else {
      callback(err, data);
    }
  });
};

// Update data inside a file
lib.update = (dir, file, data, callback) => {
  // Open the file for writing
  const filePath = path.join(lib.baseDir, dir, file + ".json");
  fs.open(filePath, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to a string
      const stringData = JSON.stringify(data);

      // Truncate the file
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          // Write to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error closing existing file");
                }
              });
            } else {
              callback("Error writing to existing file");
            }
          });
        } else {
          callback("Error truncating file");
        }
      });
    } else {
      callback("Could not open the file for updating. It might not exist yet");
    }
  });
};

// Delete a file
lib.delete = (dir, file, callback) => {
  // Unlink the file
  const filePath = path.join(lib.baseDir, dir, file + ".json");
  fs.unlink(filePath, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error deleting file");
    }
  });
};

// Export the module
module.exports = lib;
