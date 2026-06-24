const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the folder to run the script in, passed as an argument
const folder = process.argv[2];

if (!folder) {
  console.error('Please provide a folder to run the sort-functions-imports script.');
  process.exit(1);
}

const absoluteFolderPath = path.resolve(folder);

// Verify we're processing a folder within functions/src
const relativePath = path.relative(process.cwd(), absoluteFolderPath);
if (!relativePath.startsWith('functions/src') && !relativePath.startsWith('functions\\src')) {
  console.error('❌ Error: This script is only for sorting imports in the functions/src directory.');
  console.error(`   Provided path: ${relativePath}`);
  process.exit(1);
}

// Paths to exclude from sorting (relative to project root)
const EXCLUDED_PATHS = [
  // Add any excluded paths here if needed
];

function sortImportsRecursive(folderPath) {
  fs.readdirSync(folderPath).forEach((fileOrDir) => {
    const fullPath = path.join(folderPath, fileOrDir);

    if (fs.statSync(fullPath).isDirectory()) {
      sortImportsRecursive(fullPath); // Recursively sort imports in subdirectories
    } else if (fileOrDir.endsWith('.ts') || fileOrDir.endsWith('.tsx')) {
      // Check if path should be excluded
      const relativePath = path.relative(process.cwd(), fullPath);
      if (EXCLUDED_PATHS.some((pattern) => relativePath.includes(pattern))) {
        console.log('⏭️  Skipping excluded file:', relativePath);
        return;
      }

      try {
        execSync(`node ${path.join(__dirname, 'sort-functions-imports.cjs')} ${fullPath}`, {
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
