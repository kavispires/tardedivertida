#!/usr/bin/env node

/**
 * Synchronize the Dev icon collection with the icon components.
 *
 * Usage: node scripts/sync-icons-collection.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT_DIR, 'src', 'icons');
const COLLECTION_FILE = path.join(
  ROOT_DIR,
  'src',
  'pages',
  'Dev',
  'utils',
  'iconsCollection.ts',
);
const ICON_FILE_PATTERN = /^.+Icon\.tsx$/;
const EXPORT_PATTERN = /^export \* from '@icons\/([^']+)';$/;
const EXPORT_SECTION_PATTERN = /^export \* from '@icons\//m;

/**
 * Read the icon component names from the source directory.
 *
 * @returns The sorted names of eligible icon components.
 */
function getIconNames() {
  return fs
    .readdirSync(ICONS_DIR, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        ICON_FILE_PATTERN.test(entry.name) &&
        entry.name !== 'BaseIcon.tsx',
    )
    .map((entry) => entry.name.replace(/\.tsx$/, ''))
    .sort((a, b) => a.localeCompare(b, 'en'));
}

/**
 * Parse the collection preamble and existing exports.
 *
 * @returns The unchanged preamble and current export names.
 */
function readCollection() {
  const content = fs.readFileSync(COLLECTION_FILE, 'utf-8');
  const firstExportIndex = content.search(EXPORT_SECTION_PATTERN);

  if (firstExportIndex === -1) {
    throw new Error(
      `Could not find the first icon export in ${path.relative(ROOT_DIR, COLLECTION_FILE)}`,
    );
  }

  const preamble = content.slice(0, firstExportIndex);
  const exportLines = content
    .slice(firstExportIndex)
    .split(/\r?\n/)
    .filter(Boolean);
  const invalidLines = exportLines.filter((line) => !EXPORT_PATTERN.test(line));

  if (invalidLines.length > 0) {
    throw new Error(
      `Unexpected content in the icon export section:\n${invalidLines.join('\n')}`,
    );
  }

  return {
    preamble,
    exportNames: exportLines.map((line) => line.match(EXPORT_PATTERN)[1]),
  };
}

/**
 * Synchronize the collection file with the source icon components.
 */
function syncCollection() {
  const iconNames = getIconNames();
  const { preamble, exportNames: currentExportNames } = readCollection();
  const currentExportSet = new Set(currentExportNames);
  const iconNameSet = new Set(iconNames);
  const added = iconNames.filter((name) => !currentExportSet.has(name));
  const removed = currentExportNames.filter((name) => !iconNameSet.has(name));
  const exportLines = iconNames.map(
    (name) => `export * from '@icons/${name}';`,
  );
  const nextContent = `${preamble}${exportLines.join('\n')}\n`;

  if (fs.readFileSync(COLLECTION_FILE, 'utf-8') !== nextContent) {
    fs.writeFileSync(COLLECTION_FILE, nextContent);
  }

  console.log(`✓ Synchronized ${iconNames.length} icon exports`);

  if (added.length > 0) {
    console.log(`  Added: ${added.join(', ')}`);
  }

  if (removed.length > 0) {
    console.log(`  Removed: ${removed.join(', ')}`);
  }

  if (added.length === 0 && removed.length === 0) {
    console.log('  No missing or stale exports found');
  }
}

try {
  syncCollection();
} catch (error) {
  console.error(`✗ Failed to synchronize icon collection: ${error.message}`);
  process.exit(1);
}
