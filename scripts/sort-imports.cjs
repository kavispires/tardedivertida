const fs = require('fs');

const IMPORT_COMMENTS = [
  '// Ant Design Resources',
  '',
  '// Types',
  '// Hooks',
  '// Utils',
  '// Icons',
  '// State & Hooks',
  '// Resources & Utils',
  '// Icons',
  '// Helpers',
  '// Components',
  '// Sass',
  '// Constants',
  '// Images',
  '// Fonts',
  '// API & Hooks',
  '// Services',
  '// Pages',
  '// Internal',
];

function sortImportGroups(group, name) {
  const sorted = group.sort((a, b) => {
    const fromA = a.match(/from\s+'([^']+)'/)?.[1] || '';
    const fromB = b.match(/from\s+'([^']+)'/)?.[1] || '';
    return fromA.localeCompare(fromB);
  });

  if (sorted.length === 0) {
    return '';
  }

  if (name) {
    return [`// ${name}`, ...sorted, ''];
  }

  return [...sorted, ''];
}

function getPriority(path) {
  if (path.startsWith('./utils/') || path.startsWith('../utils/')) {
    return 1;
  }

  if (path.startsWith('./components/') || path.startsWith('../components/')) {
    return 2;
  }

  return 3;
}

function sortRelativeImports(group) {
  const sorted = group.sort((a, b) => {
    const fromA = a.match(/from\s+'([^']+)'/)?.[1] || '';
    const fromB = b.match(/from\s+'([^']+)'/)?.[1] || '';

    const priorityA = getPriority(fromA);
    const priorityB = getPriority(fromB);

    return priorityA - priorityB;
  });

  if (sorted.length === 0) {
    return '';
  }

  return ['// Internal', ...sorted, ''];
}

// Sorting function
const sortImports = (imports) => {
  const groups = {
    external: [],
    antd: [],
    hooks: [],
    types: [],
    constants: [],
    services: [],
    utils: [],
    icons: [],
    components: [],
    relative: [],
    pages: [],
    images: [],
    sass: [],
  };

  imports.forEach((line) => {
    // Ant Design imports
    if (line.includes("'antd'") || line.includes("'@ant-design/icons'")) {
      groups.antd.push(line);
    }
    // Hooks imports
    else if (line.includes("'hooks/")) {
      groups.hooks.push(line);
    }
    // Types imports
    else if (line.includes("'types/")) {
      groups.types.push(line);
    }
    // Constants imports
    else if (line.includes("'constants/")) {
      groups.constants.push(line);
    }
    // Services imports
    else if (line.includes("'services/")) {
      groups.services.push(line);
    }
    // Utils imports
    else if (line.includes("'utils/")) {
      groups.utils.push(line);
    }
    // Icons imports
    else if (line.includes("'icons/")) {
      groups.icons.push(line);
    }
    // Components imports
    else if (line.includes("'components/")) {
      groups.components.push(line);
    }
    // Sass imports
    else if (line.endsWith(".scss';")) {
      groups.sass.push(line);
    }
    // Images imports
    else if (line.endsWith(".png';") || line.endsWith(".svg';") || line.endsWith(".jpg';") || line.endsWith(".svg?url';")) {
      groups.images.push(line);
    }
    // Page imports
    else if (line.includes("'pages/")) {
      groups.pages.push(line);
    }
    // Relative imports
    else if (line.includes("'./") || line.includes("'../")) {
      groups.relative.push(line);
    } else {
      groups.external.push(line);
    }
  });

  const newLines = [
    ...sortImportGroups(groups.external),
    ...sortImportGroups(groups.antd, 'Ant Design Resources'),
    ...sortImportGroups(groups.types, 'Types'),
    ...sortImportGroups(groups.hooks, 'Hooks'),
    ...sortImportGroups(groups.constants, 'Constants'),
    ...sortImportGroups(groups.services, 'Services'),
    ...sortImportGroups(groups.utils, 'Utils'),
    ...sortImportGroups(groups.icons, 'Icons'),
    ...sortImportGroups(groups.components, 'Components'),
    ...sortImportGroups(groups.pages, 'Pages'),
    ...sortRelativeImports(groups.relative),
    ...sortImportGroups(groups.images, 'Images'),
    ...sortImportGroups(groups.sass, 'Sass'),
  ].filter(Boolean);

  newLines.push('');

  return newLines.join('\n');
};

// Combine duplicate imports from the same module
const combineDuplicateImports = (importLines) => {
  // Group imports by module path
  const importsByModule = {};
  const sideEffectImports = []; // Track side-effect imports (no 'from' clause)

  importLines.forEach((line) => {
    const match = line.match(/from\s+['"]([^'"]+)['"]/);
    if (!match) {
      // Side-effect import (e.g., import './styles.scss')
      sideEffectImports.push(line);
      return;
    }

    const modulePath = match[1];

    if (!importsByModule[modulePath]) {
      importsByModule[modulePath] = {
        lines: [],
        isType: line.includes('import type'),
      };
    }

    importsByModule[modulePath].lines.push(line);
  });

  // Combine duplicates
  const combinedImports = [];

  Object.entries(importsByModule).forEach(([modulePath, { lines, isType }]) => {
    if (lines.length === 1) {
      combinedImports.push(lines[0]);
      return;
    }

    // Extract all imported items from multiple imports
    const allImports = [];

    lines.forEach((line) => {
      // Match named imports: import { A, B } or import type { A, B }
      const namedMatch = line.match(/import\s+(?:type\s+)?\{\s*([^}]+)\s*\}/);
      if (namedMatch) {
        const items = namedMatch[1]
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        allImports.push(...items);
      }
      // Match default imports: import X from or import type X from
      else {
        const defaultMatch = line.match(/import\s+(?:type\s+)?([^\s{]+)\s+from/);
        if (defaultMatch) {
          allImports.push(defaultMatch[1]);
        }
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
    const typeKeyword = isType ? 'type ' : '';
    const combinedLine = `import ${typeKeyword}{ ${uniqueImports.join(', ')} } from '${modulePath}';`;
    combinedImports.push(combinedLine);
  });

  // Add side-effect imports back
  return [...combinedImports, ...sideEffectImports];
};

// Process a single file
const processFile = (filePath) => {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lines = fileContents.split('\n');

  // Extract biome-ignore-all directives at the beginning of the file
  const biomeIgnoreLines = [];
  let startIndex = 0;

  while (startIndex < lines.length && lines[startIndex].trim().startsWith('/** biome-ignore-all')) {
    biomeIgnoreLines.push(lines[startIndex]);
    startIndex++;
  }

  // Extract import lines
  const importLines = [];
  const nonImportLines = [];

  let currentImport = '';

  lines.slice(startIndex).forEach((line) => {
    if (line.startsWith('import ')) {
      // If it's single line import, add it to the import lines
      if (line.endsWith(';')) {
        importLines.push(line);
      } else {
        // If it's a multiline import, start adding to the current import
        currentImport = line.trim() + ' ';
      }
    } else if (currentImport) {
      // If we are in a multiline import, continue to add the line
      currentImport += line.trim() + ' ';
      if (line.endsWith(';')) {
        importLines.push(currentImport.trim());
        currentImport = '';
      }
    }
    // If it's not an import line and not an import comment, add it to non-import lines
    else if (line.trim() === '' || !IMPORT_COMMENTS.includes(line.trim())) {
      nonImportLines.push(line);
    }
    // Skip any lines that are import comments - they'll be re-added by sortImports
  });

  // Combine duplicate imports from same modules
  const deduplicatedImports = combineDuplicateImports(importLines);

  const sortedImports = sortImports(deduplicatedImports);

  // Remove leading empty lines from non-import content
  while (nonImportLines.length > 0 && nonImportLines[0].trim() === '') {
    nonImportLines.shift();
  }

  // Remove single-line comments that appear directly after imports
  while (nonImportLines.length > 0 && nonImportLines[0].trim().startsWith('//')) {
    nonImportLines.shift();
  }

  // Remove any additional empty lines that may appear after the comments
  while (nonImportLines.length > 0 && nonImportLines[0].trim() === '') {
    nonImportLines.shift();
  }

  // Replace original imports with sorted imports
  const biomeIgnoreContent = biomeIgnoreLines.length > 0 ? biomeIgnoreLines.join('\n') + '\n' : '';
  const newFileContents = biomeIgnoreContent + sortedImports + '\n' + nonImportLines.join('\n');

  // Write the changes back to the file
  fs.writeFileSync(filePath, newFileContents, 'utf8');
};

// Process each staged file
const processStagedFiles = () => {
  const files = process.argv.slice(2); // Get the files passed to the script

  files.forEach((file) => {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      processFile(file);
    }
  });
};

processStagedFiles();
