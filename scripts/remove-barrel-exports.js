/**
 * jscodeshift codemod to replace barrel imports with direct imports
 *
 * Usage: npx jscodeshift -t scripts/remove-barrel-exports.js src --extensions=ts,tsx --parser=tsx --dry
 * Remove --dry to apply changes
 *
 * Example transformation:
 * Before: import { DebugOnly } from 'components/debug'
 * After:  import { DebugOnly } from 'components/debug/DebugOnly'
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let hasModifications = false;

  // Configuration: Map of directories to their exported components
  // Each component maps to its file name (without extension)
  const BARREL_MAPPINGS = {
    // Phase 1: Low-risk
    'debug': {
      'DebugOnly': 'DebugOnly',
      'DevButton': 'DevButton',
    },
    'points': {
      'StarPoints': 'StarPoints',
    },
    'pop-up': {
      'messageContent': 'messageContent',
    },
    'sprites': {
      'Sprite': 'Sprite',
      'DEFAULT_SPRITE_SIZE': 'Sprite',
    },

    // Phase 2: Medium-risk A
    'ribbons': {
      'Ribbon': 'Ribbon',
      'RibbonGroup': 'RibbonGroup',
      'ribbonStyles': 'ribbonStyles',
    },
    'input': {
      'ControlledInputWriting': 'ControlledInputWriting',
    },
    'errors': {
      'PageError': 'PageError',
      'RouteError': 'RouteError',
    },
    'drawers': {
      'GameInfoDrawer': 'GameInfoDrawer',
    },
    'drag-and-drop': {
      'DragAndDrop': 'DragAndDrop',
      'DroppableArea': 'DragAndDrop',
      'DraggableItem': 'DragAndDrop',
    },
    'loaders': {
      'Loading': 'Loading',
      'LoadingBar': 'LoadingBar',
      'LoadingPage': 'LoadingPage',
    },

    // Phase 3: Medium-risk B
    'cards': {
      'Card': 'Card',
    },
    'avatars': {
      'IconAvatar': 'IconAvatar',
      'NPCPlayerAvatar': 'NPCPlayerAvatar',
    },
    'admin': {
      'AdminOnlyContainer': 'AdminOnlyContainer',
      'AdminMenuDrawer': 'AdminMenuDrawer',
      'AdminNextPhaseButton': 'AdminNextPhaseButton',
      'AdminButton': 'AdminButton',
      'AdminOnlyButton': 'AdminOnlyButton',
    },
    'game-over': {
      'GameOver': 'GameOver',
      'GameOverWrapper': 'GameOverWrapper',
    },
    'rules': {
      'CollapsibleRule': 'CollapsibleRule',
      'PopoverRule': 'PopoverRule',
      'RulesCarousel': 'RulesCarousel',
      'RulesList': 'RulesList',
      'RulesModal': 'RulesModal',
    },
    'session': {
      'Session': 'Session',
    },
    'round': {
      'RoundAnnouncement': 'RoundAnnouncement',
    },

    // Phase 4: High-risk
    'canvas': {
      'Canvas': 'Canvas',
      'CanvasResizer': 'CanvasResizer',
      'CanvasSVG': 'CanvasSVG',
      'DrawingCanvas': 'DrawingCanvas',
    },
    'slide-show': {
      'SlideShow': 'SlideShow',
      'slideShowStyles': 'styles',
      'SlideShowLabel': 'SlideShowComposableComponents',
      'SlideShowBubbleValue': 'SlideShowComposableComponents',
      'SlideShowPlayersList': 'SlideShowComposableComponents',
      'SlideShowNoWins': 'SlideShowComposableComponents',
      'SlideShowControls': 'SlideShowControls',
    },
    'players': {
      'ReadyPlayersBar': 'ReadyPlayersBar',
      'TurnOrder': 'TurnOrder',
      'WaitingRoom': 'WaitingRoom',
    },
    'image-cards': {
      'ImageBlurButton': 'ImageBlurButton',
      'ImageCard': 'ImageCard',
      'ImageCardHand': 'ImageCardHand',
      'ImageCardButton': 'ImageCardButton',
      'ImageCardSelectButton': 'ImageCardSelectButton',
      'ImageCardPreloadHand': 'ImageCardPreloadHand',
      'ImageBlurButtonContainer': 'ImageBlurButtonContainer',
      'ImageCardBack': 'ImageCardBack',
    },
    'ranking': {
      'RankingBoard': 'RankingBoard',
      'StepRankingWrapper': 'StepRankingWrapper',
    },
    'views': {
      'View': 'View',
      'ViewIf': 'ViewIf',
      'ViewSwitch': 'ViewSwitch',
    },
    'host': {
      'HostButton': 'HostButton',
      'HostNextPhaseButton': 'HostNextPhaseButton',
      'HostOnlyButton': 'HostOnlyButton',
      'HostOnlyContainer': 'HostOnlyContainer',
      'HostTimedButton': 'HostTimedButton',
    },

    // Phase 5: Critical
    'buttons': {
      'SendButton': 'SendButton',
      'TimedButton': 'TimedButton',
      'TransparentButton': 'TransparentButton',
      'FixedMenuButton': 'FixedMenuButton',
    },
    'player': {
      'PlayerAvatar': 'PlayerAvatar',
      'PlayerAvatarCard': 'PlayerAvatarCard',
      'PlayerAvatarEntry': 'PlayerAvatarEntry',
      'PlayerAvatarName': 'PlayerAvatarName',
      'PlayerAvatarStrip': 'PlayerAvatarStrip',
      'PlayerAvatarTooltip': 'PlayerAvatarTooltip',
      'PlayerFlex': 'PlayerFlex',
      'PlayerSpace': 'PlayerSpace',
    },
    'steps': {
      'Step': 'Step',
      'StepSwitcher': 'StepSwitcher',
      'StepProps': 'Step',
    },
    'phases': {
      'PhaseAnnouncement': 'PhaseAnnouncement',
      'PhaseContainer': 'PhaseContainer',
      'PhaseError': 'PhaseError',
      'PhaseLobby': 'PhaseLobby',
      'PhaseSetup': 'PhaseSetup',
      'PhaseTimerReset': 'PhaseTimerReset',
      'PhaseLoading': 'PhaseLoading',
      'PhasePlaceholder': 'PhasePlaceholder',
    },
    'language': {
      'Translate': 'Translate',
      'DualTranslate': 'DualTranslate',
      'LanguageSwitch': 'LanguageSwitch',
    },
    'text': {
      'Instruction': 'Instruction',
      'RuleInstruction': 'RuleInstruction',
      'StepTitle': 'StepTitle',
      'TextHighlight': 'TextHighlight',
      'Title': 'Title',
      'RoundsLeftInstruction': 'RoundsLeftInstruction',
    },
    'timers': {
      'TimerClock': 'TimerClock',
      'TimedTimerBar': 'TimedTimerBar',
      'TimerBar': 'TimerBar',
      'TimedTimerClock': 'TimedTimerClock',
      'WaitingTime': 'WaitingTime',
    },
  };

  // Active barrels for this run (set via --barrel-group flag or environment variable)
  const activeGroup = process.env.BARREL_GROUP || 'phase1';
  const getActiveBarrels = () => {
    switch (activeGroup) {
      case 'phase1': return ['debug', 'points', 'pop-up', 'sprites'];
      case 'phase2a': return ['ribbons', 'input', 'errors', 'drawers', 'drag-and-drop', 'loaders'];
      case 'phase2b': return ['cards', 'avatars', 'admin', 'game-over', 'rules', 'session', 'round'];
      case 'phase3': return ['canvas', 'slide-show', 'players', 'image-cards', 'ranking', 'views', 'host'];
      case 'phase4': return ['buttons', 'player', 'steps', 'phases', 'language', 'text'];
      case 'timers': return ['timers'];
      case 'all': return Object.keys(BARREL_MAPPINGS);
      default: return ['debug', 'points', 'pop-up', 'sprites'];
    }
  };

  const activeBarrels = getActiveBarrels();

  // Helper to check if import is from a barrel we're processing
  const isBarrelImport = (importPath) => {
    return activeBarrels.some(barrel => {
      return importPath === `components/${barrel}` ||
             importPath.startsWith(`components/${barrel}/index`);
    });
  };

  // Helper to get barrel name from import path
  const getBarrelName = (importPath) => {
    for (const barrel of activeBarrels) {
      if (importPath === `components/${barrel}` || importPath.startsWith(`components/${barrel}/index`)) {
        return barrel;
      }
    }
    return null;
  };

  // Transform regular imports
  root.find(j.ImportDeclaration).forEach(path => {
    const importPath = path.node.source.value;

    if (!isBarrelImport(importPath)) {
      return;
    }

    const barrelName = getBarrelName(importPath);
    if (!barrelName) return;

    const specifiers = path.node.specifiers;
    if (!specifiers || specifiers.length === 0) {
      return; // No specifiers, nothing to transform
    }

    const mapping = BARREL_MAPPINGS[barrelName];
    if (!mapping) return;

    // Group specifiers by their destination file
    const groupedByFile = {};

    specifiers.forEach(specifier => {
      if (specifier.type === 'ImportSpecifier') {
        const importedName = specifier.imported.name;
        const localName = specifier.local.name;

        const targetFile = mapping[importedName];
        if (!targetFile) {
          console.warn(`Warning: ${importedName} not found in ${barrelName} mappings`);
          return;
        }

        if (!groupedByFile[targetFile]) {
          groupedByFile[targetFile] = [];
        }

        groupedByFile[targetFile].push({
          imported: importedName,
          local: localName
        });
      }
    });

    // Create new import declarations grouped by file
    const newImports = [];

    Object.entries(groupedByFile).forEach(([targetFile, specs]) => {
      const newImportPath = `components/${barrelName}/${targetFile}`;
      const importSpecifiers = specs.map(spec =>
        j.importSpecifier(j.identifier(spec.imported), j.identifier(spec.local))
      );

      newImports.push(
        j.importDeclaration(importSpecifiers, j.literal(newImportPath))
      );
    });

    if (newImports.length > 0) {
      // Replace the original import with new imports
      j(path).replaceWith(newImports);
      hasModifications = true;
    }
  });

  // Transform type imports (import type { ... })
  root.find(j.ImportDeclaration).forEach(path => {
    if (path.node.importKind !== 'type') {
      return;
    }

    const importPath = path.node.source.value;

    if (!isBarrelImport(importPath)) {
      return;
    }

    const barrelName = getBarrelName(importPath);
    if (!barrelName) return;

    const specifiers = path.node.specifiers;
    if (!specifiers || specifiers.length === 0) {
      return;
    }

    const mapping = BARREL_MAPPINGS[barrelName];
    if (!mapping) return;

    // Group specifiers by their destination file
    const groupedByFile = {};

    specifiers.forEach(specifier => {
      if (specifier.type === 'ImportSpecifier') {
        const importedName = specifier.imported.name;
        const localName = specifier.local.name;

        const targetFile = mapping[importedName];
        if (!targetFile) {
          console.warn(`Warning: ${importedName} not found in ${barrelName} mappings`);
          return;
        }

        if (!groupedByFile[targetFile]) {
          groupedByFile[targetFile] = [];
        }

        groupedByFile[targetFile].push({
          imported: importedName,
          local: localName
        });
      }
    });

    // Create new type import declarations grouped by file
    const newImports = [];

    Object.entries(groupedByFile).forEach(([targetFile, specs]) => {
      const newImportPath = `components/${barrelName}/${targetFile}`;
      const importSpecifiers = specs.map(spec =>
        j.importSpecifier(j.identifier(spec.imported), j.identifier(spec.local))
      );

      const newImport = j.importDeclaration(importSpecifiers, j.literal(newImportPath));
      newImport.importKind = 'type';

      newImports.push(newImport);
    });

    if (newImports.length > 0) {
      j(path).replaceWith(newImports);
      hasModifications = true;
    }
  });

  return hasModifications ? root.toSource() : null;
};
