const { execSync } = require('child_process');
const path = require('path');

// Get the folder to run the script in, passed as an argument
const folder = process.argv[2];

if (!folder) {
  console.error('Please provide a folder to run the sort-imports script.');
  process.exit(1);
}

const absoluteFolderPath = path.resolve(folder);

try {
  // Run the sort-imports script in the specified folder
  execSync(
    `node ${path.join(__dirname, 'sort-imports.js')} ${absoluteFolderPath}/*.ts ${absoluteFolderPath}/*.tsx`,
    {
      stdio: 'inherit', // This will pipe the script output to the console
    }
  );
  console.log('Imports sorted successfully in', absoluteFolderPath);
} catch (error) {
  console.error('Error sorting imports:', error.message);
  process.exit(1);
}
