const fs = require('fs');
const path = require('path');

/**
 * Sorts export statements in a file alphabetically by their file path
 * Usage: node scripts/sort-exports.cjs <file-path>
 */
function sortExports(filePath) {
  if (!filePath) {
    console.error('Error: Please provide a file path');
    console.log('Usage: yarn sort-exports <file-path>');
    process.exit(1);
  }

  const absolutePath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File not found: ${absolutePath}`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(absolutePath, 'utf8');
    const lines = content.split('\n');

    // Separate export lines from other content
    const exportLines = [];
    const otherLines = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      // Match export statements like: export * from './Something';
      // or export { Something } from './path';
      if (trimmed.startsWith('export ') && trimmed.includes('from ')) {
        exportLines.push(line);
      } else {
        otherLines.push(line);
      }
    });

    // Sort export lines alphabetically by the path (case-insensitive)
    exportLines.sort((a, b) => {
      const pathA = extractPath(a).toLowerCase();
      const pathB = extractPath(b).toLowerCase();
      return pathA.localeCompare(pathB);
    });

    // Reconstruct the file content
    let newContent;

    // If there are other lines (comments, empty lines, etc.) keep them at the top
    if (otherLines.some(line => line.trim() !== '')) {
      const leadingContent = otherLines.join('\n').trimEnd();
      newContent = leadingContent ? `${leadingContent}\n${exportLines.join('\n')}\n` : `${exportLines.join('\n')}\n`;
    } else {
      newContent = exportLines.length > 0 ? `${exportLines.join('\n')}\n` : '';
    }

    // Write the sorted content back to the file
    fs.writeFileSync(absolutePath, newContent, 'utf8');

    console.log(`✓ Successfully sorted ${exportLines.length} export statements in ${filePath}`);
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Extracts the path from an export statement
 */
function extractPath(line) {
  const match = line.match(/from\s+['"](.+?)['"]/);
  return match ? match[1] : '';
}

// Get file path from command line arguments
const filePath = process.argv[2];
sortExports(filePath);
