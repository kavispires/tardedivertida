const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the folder to run the script in, passed as an argument
const folder = process.argv[2];

if (!folder) {
  console.error('Please provide a folder to run the sort-imports script.');
  process.exit(1);
}

const absoluteFolderPath = path.resolve(folder);

function sortImportsRecursive(folderPath) {
  fs.readdirSync(folderPath).forEach((fileOrDir) => {
    const fullPath = path.join(folderPath, fileOrDir);

    if (fs.statSync(fullPath).isDirectory()) {
      sortImportsRecursive(fullPath); // Recursively sort imports in subdirectories
    } else if (fileOrDir.endsWith('.ts') || fileOrDir.endsWith('.tsx')) {
      try {
        execSync(`node ${path.join(__dirname, 'sort-imports.js')} ${fullPath}`, {
          stdio: 'inherit',
        });
        console.log('♻️ Imports sorted successfully in', fullPath);

        // Add the modified file to staging
        execSync(`git add ${fullPath}`, {
          stdio: 'inherit',
        });
      } catch (error) {
        console.error('Error sorting imports:', error.message);
        process.exit(1);
      }
    }
  });
}

sortImportsRecursive(absoluteFolderPath);
