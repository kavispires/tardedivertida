#!/usr/bin/env node
/**
 * Script to revert auto-incremented version numbers in game-info.json files
 *
 * This script reverts version numbers in modified game-info.json files to their
 * previous commit state (HEAD), while preserving all other changes. Useful when
 * committing WIP that gets reset later, leaving version numbers unnecessarily incremented.
 *
 * The script compares your working directory against the last commit (HEAD).
 *
 * Usage:
 *   yarn revert-versions                    (interactive mode with prompts)
 *   node scripts/revert-game-versions.cjs   (interactive mode with prompts)
 *   node scripts/revert-game-versions.cjs [options]  (with command-line flags)
 *
 * Interactive Mode:
 *   When run without flags, the script will prompt for:
 *   - Whether to include package.json
 *   Then displays all changes and asks for confirmation before reverting.
 *
 * Options (skip interactive prompts):
 *   --include-package    Also revert package.json version
 *   --yes               Skip confirmation prompt (for automation)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  includePackage: args.includes('--include-package'),
  yes: args.includes('--yes'),
};

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Execute a git command and return the output
 */
function gitCommand(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : ['pipe', 'pipe', 'pipe']
    }).trim();
  } catch (error) {
    if (options.ignoreError) {
      return null;
    }
    throw error;
  }
}

/**
 * Get the current branch name for display
 */
function getCurrentBranch() {
  try {
    return gitCommand('git rev-parse --abbrev-ref HEAD', { silent: true });
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Extract version from a file content
 */
function extractVersion(content) {
  const match = content.match(/"version":\s*"([^"]+)"/);
  return match ? match[1] : null;
}

/**
 * Extract game metadata from game-info.json content
 */
function extractGameMetadata(content) {
  try {
    const json = JSON.parse(content);
    return {
      gameName: json.gameName || 'Unknown',
      gameCode: json.gameCode || '?',
      title: json.title?.pt || json.title?.en || 'Unknown Game',
    };
  } catch (error) {
    return {
      gameName: 'Unknown',
      gameCode: '?',
      title: 'Unknown Game',
    };
  }
}

/**
 * Get modified game-info.json files
 */
function getModifiedFiles() {
  const changes = [];

  // Find all modified game-info.json files compared to HEAD (last commit)
  const diffOutput = gitCommand(
    `git diff HEAD --name-only src/games/*/game-info.json`,
    { ignoreError: true, silent: true }
  );

  if (diffOutput) {
    const files = diffOutput.split('\n').filter(Boolean);

    for (const file of files) {
      const filePath = path.join(process.cwd(), file);

      // Check if file exists in working directory
      if (!fs.existsSync(filePath)) {
        console.log(`${colors.dim}  ⊘ Skipping deleted file: ${file}${colors.reset}`);
        continue;
      }

      // Get current version from working copy
      const currentContent = fs.readFileSync(filePath, 'utf-8');
      const currentVersion = extractVersion(currentContent);

      // Get previous version from HEAD (last commit)
      let previousContent;
      try {
        previousContent = gitCommand(`git show HEAD:${file}`, { silent: true });
      } catch (error) {
        console.log(`${colors.dim}  ⊘ Skipping new file: ${file}${colors.reset}`);
        continue;
      }

      const previousVersion = extractVersion(previousContent);

      // Skip if no version change
      if (currentVersion === previousVersion) {
        continue;
      }

      // Skip non-numeric versions (pre-release)
      if (!currentVersion || !currentVersion.match(/^\d+\.\d+\.\d+$/)) {
        console.log(`${colors.dim}  ⊘ Skipping pre-release version: ${file} (${currentVersion})${colors.reset}`);
        continue;
      }

      // Extract game metadata for display
      const metadata = extractGameMetadata(currentContent);

      changes.push({
        file,
        filePath,
        currentVersion,
        previousVersion,
        metadata,
      });
    }
  }

  // Handle package.json if flag is set
  if (flags.includePackage) {
    const packagePath = path.join(process.cwd(), 'package.json');

    if (fs.existsSync(packagePath)) {
      const currentContent = fs.readFileSync(packagePath, 'utf-8');
      const currentVersion = extractVersion(currentContent);

      try {
        const previousContent = gitCommand(`git show HEAD:package.json`, { silent: true });
        const previousVersion = extractVersion(previousContent);

        if (currentVersion !== previousVersion) {
          changes.push({
            file: 'package.json',
            filePath: packagePath,
            currentVersion,
            previousVersion,
            metadata: {
              gameName: 'tardedivertida',
              gameCode: 'PKG',
              title: 'Tarde Divertida (package.json)',
            },
          });
        }
      } catch (error) {
        // package.json should always exist in HEAD
        console.log(`${colors.yellow}  ⚠ Could not read package.json from HEAD${colors.reset}`);
      }
    }
  }

  return changes;
}

/**
 * Display summary of changes
 */
function displaySummary(changes) {
  if (changes.length === 0) {
    console.log(`\n${colors.green}✓ No version changes detected${colors.reset}`);
    return;
  }

  console.log(`\n${colors.bright}${colors.cyan}Version Changes to Revert:${colors.reset}\n`);

  const maxNameLength = Math.max(...changes.map(c => c.metadata.title.length), 20);

  for (const change of changes) {
    const { metadata, currentVersion, previousVersion } = change;
    const name = metadata.title.padEnd(maxNameLength);
    const code = `(${metadata.gameCode})`.padEnd(5);

    console.log(
      `  ${colors.bright}${name}${colors.reset} ` +
      `${colors.dim}${code}${colors.reset} ` +
      `${colors.red}${currentVersion}${colors.reset} → ` +
      `${colors.green}${previousVersion}${colors.reset}`
    );
  }

  console.log(`\n${colors.dim}Total files to revert: ${changes.length}${colors.reset}`);
}

/**
 * Prompt for user confirmation
 */
function promptConfirmation() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`\n${colors.yellow}Continue with revert? (y/N):${colors.reset} `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Revert version in a file using sed (same approach as pre-commit hook)
 */
function revertVersion(change) {
  const { filePath, currentVersion, previousVersion } = change;

  try {
    // Use sed to replace only the version line
    execSync(
      `sed -i.bak "s/\\"version\\": \\"${currentVersion}\\"/\\"version\\": \\"${previousVersion}\\"/" "${filePath}"`,
      { encoding: 'utf-8' }
    );

    // Clean up backup file
    const backupPath = `${filePath}.bak`;
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }

    return true;
  } catch (error) {
    console.error(`${colors.red}  ✗ Failed to revert ${change.file}: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Prompt for yes/no question
 */
function promptYesNo(question, defaultValue = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const defaultText = defaultValue ? '(Y/n)' : '(y/N)';
    rl.question(`${colors.yellow}${question} ${defaultText}:${colors.reset} `, (answer) => {
      rl.close();
      const normalized = answer.toLowerCase().trim();
      if (normalized === '') {
        resolve(defaultValue);
      } else {
        resolve(normalized === 'y' || normalized === 'yes');
      }
    });
  });
}



/**
 * Interactive options prompt
 */
async function promptOptions() {
  // Only prompt if no flags were passed
  const hasFlags = args.includes('--include-package') || args.includes('--yes');

  if (hasFlags) {
    return; // Use command-line flags
  }

  console.log(`${colors.bright}${colors.cyan}Options${colors.reset}\n`);

  // Prompt for include package
  flags.includePackage = await promptYesNo('Also revert package.json version?', false);

  console.log(''); // Empty line for spacing
}

/**
 * Main execution
 */
async function main() {
  console.log(`${colors.bright}${colors.blue}🔄 Game Version Revert Tool${colors.reset}\n`);

  // Prompt for options if running interactively
  await promptOptions();

  // Get current branch for display
  const currentBranch = getCurrentBranch();
  console.log(`${colors.dim}Comparing against: HEAD (last commit on ${currentBranch})${colors.reset}`);

  if (flags.includePackage) {
    console.log(`${colors.dim}Including package.json${colors.reset}`);
  }

  // Get modified files
  const changes = getModifiedFiles();

  // Display summary
  displaySummary(changes);

  if (changes.length === 0) {
    process.exit(0);
  }

  // Prompt for confirmation unless --yes flag is set
  if (!flags.yes) {
    const confirmed = await promptConfirmation();
    if (!confirmed) {
      console.log(`\n${colors.yellow}Revert cancelled${colors.reset}`);
      process.exit(0);
    }
  }

  // Apply reverts
  console.log(`\n${colors.bright}Applying reverts...${colors.reset}\n`);

  let reverted = 0;
  let failed = 0;

  for (const change of changes) {
    if (revertVersion(change)) {
      console.log(`${colors.green}  ✓${colors.reset} ${change.metadata.title}: ${change.currentVersion} → ${change.previousVersion}`);
      reverted++;
    } else {
      failed++;
    }
  }

  // Final summary
  console.log(`\n${colors.bright}${colors.green}✅ Done!${colors.reset}`);
  console.log(`${colors.dim}Reverted: ${reverted}, Failed: ${failed}${colors.reset}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error(`\n${colors.red}❌ Error: ${error.message}${colors.reset}`);
  process.exit(1);
});
