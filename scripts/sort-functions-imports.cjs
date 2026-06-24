const fs = require('fs');

/**
 * Determines the import style of an import statement
 * @param {string} line - The import line to analyze
 * @returns {'namespace'|'default'|'named'|'type'|'side-effect'} The import style
 */
function getImportStyle(line) {
  // Side-effect import (no 'from' clause)
  if (!line.includes('from')) {
    return 'side-effect';
  }

  // Namespace import: import * as X from
  if (line.match(/import\s+\*\s+as\s+\w+\s+from/)) {
    return 'namespace';
  }

  // Type import: import type
  if (line.match(/import\s+type\s+/)) {
    return 'type';
  }

  // Named import: import { ... } from
  if (line.match(/import\s+\{/)) {
    return 'named';
  }

  // Default import: import X from
  return 'default';
}

/**
 * Combines duplicate imports from the same module, but only if they use the same import style
 * @param {string[]} importLines - Array of import statements
 * @returns {string[]} Array of deduplicated import statements
 */
const combineDuplicateImports = (importLines) => {
  // Group imports by module path AND import style
  const importsByModuleAndStyle = {};
  const sideEffectImports = [];

  importLines.forEach((line) => {
    const match = line.match(/from\s+['"]([^'"]+)['"]/);
    if (!match) {
      // Side-effect import
      sideEffectImports.push(line);
      return;
    }

    const modulePath = match[1];
    const style = getImportStyle(line);
    const key = `${modulePath}::${style}`;

    if (!importsByModuleAndStyle[key]) {
      importsByModuleAndStyle[key] = {
        lines: [],
        modulePath,
        style,
      };
    }

    importsByModuleAndStyle[key].lines.push(line);
  });

  // Combine duplicates with same module path AND style
  const combinedImports = [];

  Object.entries(importsByModuleAndStyle).forEach(([_, { lines, modulePath, style }]) => {
    if (lines.length === 1) {
      combinedImports.push(lines[0]);
      return;
    }

    // Only combine if it's named or type imports with same style
    if (style === 'named' || style === 'type') {
      // Extract all imported items from multiple imports
      const allImports = [];

      lines.forEach((line) => {
        const namedMatch = line.match(/import\s+(?:type\s+)?\{\s*([^}]+)\s*\}/);
        if (namedMatch) {
          const items = namedMatch[1]
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
          allImports.push(...items);
        }
      });

      // Remove duplicates while preserving order
      const seen = new Set();
      const uniqueImports = [];
      allImports.forEach((item) => {
        if (!seen.has(item)) {
          seen.add(item);
          uniqueImports.push(item);
        }
      });

      // Create combined import statement
      const typeKeyword = style === 'type' ? 'type ' : '';
      const combinedLine = `import ${typeKeyword}{ ${uniqueImports.join(', ')} } from '${modulePath}';`;
      combinedImports.push(combinedLine);
    } else {
      // Don't combine namespace, default, or other import styles - keep all separate
      combinedImports.push(...lines);
    }
  });

  // Add side-effect imports back
  return [...combinedImports, ...sideEffectImports];
};

/**
 * Sorts import groups and adds comment headers
 * @param {string[]} group - Array of import statements
 * @param {string} [name] - Optional group name for comment header
 * @returns {string[]} Sorted import group with comment header
 */
function sortImportGroups(group, name) {
  const sorted = group.sort((a, b) => {
    const fromA = a.match(/from\s+['"]([^'"]+)['"]/)?.[1] || '';
    const fromB = b.match(/from\s+['"]([^'"]+)['"]/)?.[1] || '';
    return fromA.localeCompare(fromB);
  });

  if (sorted.length === 0) {
    return [];
  }

  if (name) {
    return [`// ${name}`, ...sorted, ''];
  }

  return [...sorted, ''];
}

/**
 * Checks if an import path is a type-related import
 * @param {string} path - The import path
 * @param {string} line - The full import line
 * @returns {boolean} True if this is a type import
 */
function isTypeImport(path, line) {
  // Check if it's an import type statement OR path contains 'types'
  return line.includes('import type') || path.includes('/types');
}

/**
 * Checks if an import path is a constants-related import
 * @param {string} path - The import path
 * @returns {boolean} True if this is a constants import
 */
function isConstantsImport(path) {
  return path.includes('/constants');
}

/**
 * Sorts imports according to functions directory conventions
 * @param {string[]} imports - Array of import statements
 * @returns {string} Sorted imports as a string
 */
const sortImports = (imports) => {
  const groups = {
    firebase: [],
    external: [],
    types: [],
    constants: [],
    services: [],
    api: [],
    toolKits: [],
    resources: [],
    mechanics: [],
    utils: [],
    internal: [],
  };

  imports.forEach((line) => {
    const fromMatch = line.match(/from\s+['"]([^'"]+)['"]/);
    const path = fromMatch ? fromMatch[1] : '';

    // Firebase imports (firebase-admin, firebase-functions and subroutes)
    if (path.startsWith('firebase-admin') || path.startsWith('firebase-functions')) {
      groups.firebase.push(line);
    }
    // Types imports (contains 'types' in path OR is import type from relative)
    else if (isTypeImport(path, line)) {
      groups.types.push(line);
    }
    // Constants imports (contains 'constants' in path)
    else if (isConstantsImport(path)) {
      groups.constants.push(line);
    }
    // Services imports
    else if (path.includes('/services')) {
      groups.services.push(line);
    }
    // API imports
    else if (path.includes('/api')) {
      groups.api.push(line);
    }
    // Tool Kits imports
    else if (path.includes('/tool-kits')) {
      groups.toolKits.push(line);
    }
    // Resources imports
    else if (path.includes('/resources')) {
      groups.resources.push(line);
    }
    // Mechanics imports
    else if (path.includes('/mechanics')) {
      groups.mechanics.push(line);
    }
    // Utils imports
    else if (path.includes('/utils')) {
      groups.utils.push(line);
    }
    // Relative imports (./something or ../something)
    else if (path.startsWith('./') || path.startsWith('../')) {
      groups.internal.push(line);
    }
    // External imports (everything else)
    else {
      groups.external.push(line);
    }
  });

  // Build sorted import string with firebase imports having eslint-disable-next-line
  const newLines = [];

  // Firebase imports with eslint-disable-next-line for each
  if (groups.firebase.length > 0) {
    const sortedFirebase = groups.firebase.sort((a, b) => {
      const fromA = a.match(/from\s+['"]([^'"]+)['"]/)?.[1] || '';
      const fromB = b.match(/from\s+['"]([^'"]+)['"]/)?.[1] || '';
      return fromA.localeCompare(fromB);
    });

    sortedFirebase.forEach((importLine) => {
      newLines.push('// eslint-disable-next-line');
      newLines.push(importLine);
    });
    newLines.push('');
  }

  // Add other groups
  newLines.push(...sortImportGroups(groups.external));
  newLines.push(...sortImportGroups(groups.types, 'Types'));
  newLines.push(...sortImportGroups(groups.constants, 'Constants'));
  newLines.push(...sortImportGroups(groups.services, 'Services'));
  newLines.push(...sortImportGroups(groups.api, 'API'));
  newLines.push(...sortImportGroups(groups.toolKits, 'Tool Kits'));
  newLines.push(...sortImportGroups(groups.resources, 'Resources'));
  newLines.push(...sortImportGroups(groups.mechanics, 'Mechanics'));
  newLines.push(...sortImportGroups(groups.utils, 'Utils'));
  newLines.push(...sortImportGroups(groups.internal, 'Internal'));

  const filtered = newLines.filter(Boolean);
  filtered.push('');

  return filtered.join('\n');
};

/**
 * Extracts JSDoc title comment block from the beginning of file content
 * @param {string[]} lines - Array of file lines
 * @returns {{titleComment: string[], startIndex: number}} Title comment and where content starts
 */
function extractTitleComment(lines) {
  const titleComment = [];
  let startIndex = 0;
  let inJSDoc = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Start of JSDoc comment
    if (line.startsWith('/**') && !inJSDoc) {
      inJSDoc = true;
      titleComment.push(lines[i]);
      continue;
    }

    // Inside JSDoc comment
    if (inJSDoc) {
      titleComment.push(lines[i]);
      // End of JSDoc comment
      if (line.endsWith('*/')) {
        startIndex = i + 1;
        break;
      }
      continue;
    }

    // If we hit a non-empty, non-JSDoc line, stop looking
    if (line && !line.startsWith('//')) {
      break;
    }
  }

  // Only return title comment if we actually found a complete JSDoc block
  if (inJSDoc && titleComment.length > 0 && titleComment[titleComment.length - 1].trim().endsWith('*/')) {
    return { titleComment, startIndex };
  }

  return { titleComment: [], startIndex: 0 };
}

/**
 * Process a single file to sort its imports
 * @param {string} filePath - Path to the file to process
 */
const processFile = (filePath) => {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lines = fileContents.split('\n');

  // Extract JSDoc title comment if present
  const { titleComment, startIndex } = extractTitleComment(lines);

  // Import section comment patterns to skip
  const importComments = [
    '// Type',
    '// Types',
    '// Constants',
    '// Services',
    '// API',
    '// Tool Kits',
    '// Resources',
    '// Mechanics',
    '// Utils',
    '// Utilities',
    '// Helpers',
    '// Helper',
    '// Internal',
    '// Internal Functions',
    '// Internal functions',
  ];

  // Extract import lines
  const importLines = [];
  const nonImportLines = [];
  let currentImport = '';
  let hasImports = false;
  let pastImportSection = false;

  lines.slice(startIndex).forEach((line) => {
    // If we're past the import section, keep everything as-is
    if (pastImportSection) {
      nonImportLines.push(line);
      return;
    }

    if (line.startsWith('import ')) {
      hasImports = true;
      // Single line import
      if (line.endsWith(';')) {
        importLines.push(line);
      } else {
        // Start of multiline import
        currentImport = line.trim() + ' ';
      }
    } else if (currentImport) {
      // Continue multiline import
      currentImport += line.trim() + ' ';
      if (line.endsWith(';')) {
        importLines.push(currentImport.trim());
        currentImport = '';
      }
    } else {
      // Check if this line is part of import organization
      const trimmedLine = line.trim();
      const isEmptyLine = trimmedLine === '';
      const isEslintDisable = trimmedLine.startsWith('// eslint-disable-next-line');
      const isImportComment = importComments.includes(trimmedLine);

      // If it's an import-related line, skip it
      if (isEmptyLine || isEslintDisable || isImportComment) {
        // Don't add to nonImportLines yet, but don't mark section as ended
        return;
      }

      // First real code line - marks end of import section
      pastImportSection = true;
      nonImportLines.push(line);
    }
  });

  // If there are no imports, return the file unchanged
  if (!hasImports) {
    return;
  }

  // Combine duplicate imports with same style
  const deduplicatedImports = combineDuplicateImports(importLines);

  // Sort imports
  const sortedImports = sortImports(deduplicatedImports);

  // Build final file content
  let newFileContents = '';

  // Add sorted imports
  newFileContents += sortedImports + '\n';

  // Add title comment after imports if it exists
  if (titleComment.length > 0) {
    newFileContents += titleComment.join('\n') + '\n\n';
  }

  // Add rest of the file
  newFileContents += nonImportLines.join('\n');

  // Write the changes back to the file
  fs.writeFileSync(filePath, newFileContents, 'utf8');
};

/**
 * Process each staged file in the functions/src directory
 */
const processStagedFiles = () => {
  const files = process.argv.slice(2); // Get the files passed to the script

  files.forEach((file) => {
    // Only process .ts files in the functions/src directory
    if ((file.endsWith('.ts') || file.endsWith('.tsx')) && file.includes('functions/src/')) {
      processFile(file);
    }
  });
};

processStagedFiles();
