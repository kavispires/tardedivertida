#!/usr/bin/env node

/**
 * Checks restricted icon-collection imports outside the development and per-game collection files.
 *
 * Usage: node scripts/check-icon-imports.cjs
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const RESTRICTED_MODULE = '@pages/Dev/utils/iconsCollection';
const COLLECTION_PATH = path.join(ROOT, 'src/pages/Dev/utils/iconsCollection');
const ALLOWED_FILE = 'src/icons/iconsCollectionByGame.tsx';

/**
 * Finds actual module references, including multiline imports, re-exports, and dynamic imports.
 * @param {string} filename - Absolute source-file path
 * @param {string} content - File contents to inspect
 * @returns {string[]} Violations with repository-relative paths and line numbers
 */
function getImportViolations(filename, content) {
  const relativePath = path.relative(ROOT, filename).split(path.sep).join('/');
  if (relativePath.startsWith('src/pages/Dev/') || relativePath === ALLOWED_FILE) return [];

  const violations = [];
  for (const reference of ts.preProcessFile(content, true, true).importedFiles) {
    const modulePath = reference.fileName.replace(/\.[cm]?[jt]sx?$/, '');
    const isRestricted = modulePath === RESTRICTED_MODULE ||
      modulePath === 'pages/Dev/utils/iconsCollection' ||
      modulePath.startsWith('.') && path.resolve(path.dirname(filename), modulePath) === COLLECTION_PATH;
    if (isRestricted) {
      const line = content.slice(0, reference.pos).split(/\r\n?|\n/).length;
      violations.push(`${relativePath}:${line}: ${reference.fileName}`);
    }
  }
  return violations;
}

/**
 * Recursively inspects JavaScript and TypeScript source files without following symlinks.
 * @param {string} directory - Directory to inspect
 * @returns {string[]} Unauthorized imports found beneath the directory
 */
function findViolations(directory) {
  const violations = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      violations.push(...findViolations(filename));
    } else if (entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name)) {
      violations.push(...getImportViolations(filename, fs.readFileSync(filename, 'utf8')));
    }
  }
  return violations;
}

function main() {
  try {
    const violations = findViolations(path.join(ROOT, 'src'));
    if (violations.length === 0) {
      console.log('✅ No unauthorized icon-collection imports found');
      return;
    }
    console.error(`❌ Found unauthorized imports from ${RESTRICTED_MODULE}:\n`);
    violations.forEach(violation => console.error(`  ${violation}`));
    console.error("\nUse direct imports instead: import { MyIcon } from '@icons/MyIcon';");
    process.exitCode = 1;
  } catch (error) {
    console.error('Error running check:', error.message);
    process.exitCode = 1;
  }
}

module.exports = { getImportViolations, findViolations };

if (require.main === module) {
  main();
}
