#!/usr/bin/env node
/**
 * Interactive script selector
 *
 * Displays all available npm scripts and allows you to select and run one.
 *
 * Usage:
 *   yarn scripts:list
 *   node scripts/list-scripts.cjs
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

/**
 * Read package.json and extract scripts
 */
function getAvailableScripts() {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

  // Filter out internal/lifecycle scripts
  const excludedScripts = ['scripts:list', 'prepare', 'predeploy'];

  return Object.entries(packageJson.scripts)
    .filter(([name]) => !excludedScripts.includes(name))
    .map(([name, command]) => ({ name, command }));
}

/**
 * Display scripts menu with current selection highlighted
 */
function displayMenu(scripts, selectedIndex) {
  // Clear screen and move cursor to top
  console.clear();
  console.log(`\n${colors.bright}${colors.cyan}📋 Available Scripts${colors.reset}`);
  console.log(`${colors.dim}Use ↑/↓ arrows to navigate, Enter to select, q to quit${colors.reset}\n`);

  scripts.forEach((script, index) => {
    const isSelected = index === selectedIndex;
    const prefix = isSelected ? `${colors.cyan}▶ ${colors.reset}` : '  ';
    const name = script.name.padEnd(20);
    const command = script.command;

    if (isSelected) {
      console.log(
        `${prefix}${colors.bright}${colors.cyan}${name}${colors.reset}` +
        `${colors.bright}${colors.cyan}${command}${colors.reset}`
      );
    } else {
      console.log(
        `${prefix}${colors.bright}${name}${colors.reset}` +
        `${colors.dim}${command}${colors.reset}`
      );
    }
  });

  console.log('');
}

/**
 * Interactive selection using arrow keys
 */
function interactiveSelection(scripts) {
  return new Promise((resolve) => {
    let selectedIndex = 0;

    // Set up readline in raw mode for keypress events
    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    // Display initial menu
    displayMenu(scripts, selectedIndex);

    const onKeypress = (str, key) => {
      if (key.name === 'up') {
        selectedIndex = (selectedIndex - 1 + scripts.length) % scripts.length;
        displayMenu(scripts, selectedIndex);
      } else if (key.name === 'down') {
        selectedIndex = (selectedIndex + 1) % scripts.length;
        displayMenu(scripts, selectedIndex);
      } else if (key.name === 'return') {
        cleanup();
        resolve(scripts[selectedIndex]);
      } else if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
        cleanup();
        resolve(null);
      }
    };

    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
    };

    process.stdin.on('keypress', onKeypress);
    process.stdin.resume();
  });
}

/**
 * Run the selected script
 */
function runScript(script) {
  console.log(
    `\n${colors.bright}${colors.blue}▶ Running:${colors.reset} ` +
    `${colors.bright}yarn ${script.name}${colors.reset}\n`
  );
  console.log(`${colors.dim}${'─'.repeat(60)}${colors.reset}\n`);

  try {
    execSync(`yarn ${script.name}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    console.log(`\n${colors.dim}${'─'.repeat(60)}${colors.reset}`);
    console.log(`${colors.green}✓ Script completed successfully${colors.reset}\n`);
  } catch (error) {
    console.log(`\n${colors.dim}${'─'.repeat(60)}${colors.reset}`);
    console.log(`${colors.red}✗ Script failed with exit code ${error.status}${colors.reset}\n`);
    process.exit(error.status || 1);
  }
}

/**
 * Main execution
 */
async function main() {
  const scripts = getAvailableScripts();

  if (scripts.length === 0) {
    console.log(`${colors.yellow}No scripts available${colors.reset}`);
    process.exit(0);
  }

  const selected = await interactiveSelection(scripts);

  if (selected) {
    runScript(selected);
  } else {
    console.log(`${colors.dim}Cancelled${colors.reset}\n`);
  }
}

// Run the script
main().catch((error) => {
  console.error(`\n${colors.red}❌ Error: ${error.message}${colors.reset}`);
  process.exit(1);
});
