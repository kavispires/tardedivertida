#!/usr/bin/env node
/**
 * Script to add missing StepProps and ImageBlurButtonContainer imports
 */

const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

// Find all files using  StepProps but not importing it
console.log('Finding files using StepProps without importing it...');
const stepPropsFiles = execSync(
  "grep -rl 'Pick<StepProps' src --include='*.tsx' --include='*.ts'",
  { encoding: 'utf-8' }
)
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${stepPropsFiles.length} files using StepProps`);

// Process each file
stepPropsFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if StepProps is already imported
  if (content.includes("from 'components/steps/Step'") && content.match(/import.*StepProps.*from/)) {
    console.log(`✓ ${filePath} already has StepProps import`);
    return;
  }

  // Find the last import statement
  const lines = content.split('\n');
  let lastImportIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    } else if (lastImportIndex !== -1 && lines[i].trim() && !lines[i].trim().startsWith('import')) {
      // Found first non-import line after imports
      break;
    }
  }

  if (lastImportIndex === -1) {
    console.log(`✗ ${filePath} has no imports, skipping`);
    return;
  }

  // Add the import after the last import
  const newImport = "import type { StepProps } from 'components/steps/Step';";
  lines.splice(lastImportIndex + 1, 0, newImport);

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`✓ Added StepProps import to ${filePath}`);
});

// Find files using ImageBlurButtonContainer
console.log('\nFinding files using ImageBlurButtonContainer without importing it...');
const imageBlurFiles = execSync(
  "grep -rl 'ImageBlurButtonContainer' src/games --include='*.tsx'",
  { encoding: 'utf-8' }
)
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${imageBlurFiles.length} files using ImageBlurButtonContainer`);

// Process each file
imageBlurFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if ImageBlurButtonContainer is already imported
  if (content.includes("from 'components/image-cards/ImageBlurButtonContainer'")) {
    console.log(`✓ ${filePath} already has ImageBlurButtonContainer import`);
    return;
  }

  // Find the last import statement
  const lines = content.split('\n');
  let lastImportIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    } else if (lastImportIndex !== -1 && lines[i].trim() && !lines[i].trim().startsWith('import')) {
      break;
    }
  }

  if (lastImportIndex === -1) {
    console.log(`✗ ${filePath} has no imports, skipping`);
    return;
  }

  // Add the import after the last import
  const newImport = "import { ImageBlurButtonContainer } from 'components/image-cards/ImageBlurButtonContainer';";
  lines.splice(lastImportIndex + 1, 0, newImport);

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`✓ Added ImageBlurButtonContainer import to ${filePath}`);
});

// Find files using SlideShow components
console.log('\nFinding files using SlideShow components without importing them...');
const slideShowComponents = [
  'SlideShowBubbleValue',
  'SlideShowPlayersList',
  'SlideShowLabel',
  'SlideShowNoWins'
];

slideShowComponents.forEach(component => {
  try {
    const componentFiles = execSync(
      `grep -rl '${component}' src/games --include='*.tsx' 2>/dev/null || true`,
      { encoding: 'utf-8' }
    )
      .trim()
      .split('\n')
      .filter(Boolean);

    console.log(`Found ${componentFiles.length} files using ${component}`);

    componentFiles.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check if already imported
      if (content.includes("from 'components/slide-show/SlideShowComposableComponents'")) {
        // Already has the import - but might need to add the component
        if (!content.match(new RegExp(`import.*${component}.*from`))) {
          // Need to add to existing import
          const newContent = content.replace(
            /import {([^}]+)} from 'components\/slide-show\/SlideShowComposableComponents'/,
            (match, imports) => {
              if (imports.includes(component)) {
                return match; // Already has it
              }
              return `import {${imports}, ${component}} from 'components/slide-show/SlideShowComposableComponents'`;
            }
          );
          if (newContent !== content) {
            fs.writeFileSync(filePath, newContent);
            console.log(`✓ Added ${component} to existing import in ${filePath}`);
          }
        }
        return;
      }

      // Find the last import statement
      const lines = content.split('\n');
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) {
          lastImportIndex = i;
        } else if (lastImportIndex !== -1 && lines[i].trim() && !lines[i].trim().startsWith('import')) {
          break;
        }
      }

      if (lastImportIndex === -1) {
        console.log(`✗ ${filePath} has no imports, skipping`);
        return;
      }

      // Add the import after the last import
      const newImport = `import { ${component} } from 'components/slide-show/SlideShowComposableComponents';`;
      lines.splice(lastImportIndex + 1, 0, newImport);

      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`✓ Added ${component} import to ${filePath}`);
    });
  } catch (err) {
    console.error(`Error processing ${component}:`, err.message);
  }
});

// Find files using ImageCardBack
console.log('\nFinding files using ImageCardBack without importing it...');
try {
  const imageCardBackFiles = execSync(
    "grep -rl 'ImageCardBack' src/games --include='*.tsx' 2>/dev/null || true",
    { encoding: 'utf-8' }
  )
    .trim()
    .split('\n')
    .filter(Boolean);

  console.log(`Found ${imageCardBackFiles.length} files using ImageCardBack`);

  imageCardBackFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check if ImageCardBack is already imported
    if (content.includes("from 'components/image-cards/ImageCardBack'")) {
      console.log(`✓ ${filePath} already has ImageCardBack import`);
      return;
    }

    // Find the last import statement
    const lines = content.split('\n');
    let lastImportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      } else if (lastImportIndex !== -1 && lines[i].trim() && !lines[i].trim().startsWith('import')) {
        break;
      }
    }

    if (lastImportIndex === -1) {
      console.log(`✗ ${filePath} has no imports, skipping`);
      return;
    }

    // Add the import after the last import
    const newImport = "import { ImageCardBack } from 'components/image-cards/ImageCardBack';";
    lines.splice(lastImportIndex + 1, 0, newImport);

    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`✓ Added ImageCardBack import to ${filePath}`);
  });
} catch (err) {
  console.error('Error processing ImageCardBack:', err.message);
}

console.log('\n✅ Done!');
