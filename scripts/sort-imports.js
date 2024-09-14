const fs = require('fs');
const path = require('path');

const IMPORT_COMMENTS = [
  '// Ant Design Resources',
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
    else if (line.endsWith(".scss'")) {
      groups.sass.push(line);
    }
    // Relative imports
    else if (line.includes("'./") || line.includes("'../")) {
      groups.relative.push(line);
    } else {
      groups.external.push(line);
    }
  });

  return [
    ...sortImportGroups(groups.external),
    ...sortImportGroups(groups.antd, 'Ant Design Resources'),
    ...sortImportGroups(groups.types, 'Types'),
    ...sortImportGroups(groups.hooks, 'Hooks'),
    ...sortImportGroups(groups.constants, 'Constants'),
    ...sortImportGroups(groups.services, 'Services'),
    ...sortImportGroups(groups.utils, 'Utils'),
    ...sortImportGroups(groups.icons, 'Icons'),
    ...sortImportGroups(groups.components, 'Components'),
    ...sortImportGroups(groups.relative, 'Internal'),
    ...sortImportGroups(groups.sass, 'Sass'),
  ]
    .filter(Boolean)
    .join('\n');
};

// Process a single file
const processFile = (filePath) => {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lines = fileContents.split('\n');

  // Remove all import comments that precede a import line
  const filteredLines = lines.filter((line, index) => {
    if (IMPORT_COMMENTS.includes(line.trim()) && lines[index + 1].startsWith('import ')) {
      return false;
    }
    return true;
  });

  // Extract import lines
  const importLines = filteredLines.filter((line) => line.startsWith('import '));
  // Sort the imports

  const sortedImports = sortImports(importLines);

  // Replace original imports with sorted imports
  const nonImportLines = filteredLines.filter((line) => !line.startsWith('import '));
  const newFileContents = sortedImports + '\n' + nonImportLines.join('\n');

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
