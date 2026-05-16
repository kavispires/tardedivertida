import { sampleSize } from 'lodash';
// Internal
import type { DailyPirralhosEntry, Kid } from './types';

export interface StatementContext {
  speaker: Kid;
  allKids: Kid[];
  culprits: Kid[];
  liars: Kid[];
}

export interface StatementDef {
  difficultyWeight: number; // 1 (Easy) to 3 (Hard)
  generateParam: (speaker: Kid, allKids: Kid[]) => number | undefined;
  build: (
    speaker: Kid,
    allKids: Kid[],
    param?: number,
  ) => { text: DualLanguageValue; evaluate: (ctx: StatementContext) => boolean };
}

export interface StatementInstance {
  type: number;
  param?: number;
  text: DualLanguageValue;
  evaluate: (ctx: StatementContext) => boolean;
}

export const ALL_KIDS: Kid[] = [
  {
    id: 1,
    cardId: 'us-gb-231',
    name: { en: 'Miles', pt: 'Marcus Vinícius' },
    gender: 'boy',
    height: 124,
    color: '#2b72ff',
  },
  {
    id: 2,
    cardId: 'us-gb-232',
    name: { en: 'Penny', pt: 'Penélope' },
    gender: 'girl',
    height: 120,
    color: '#ff69c0',
  },
  {
    id: 3,
    cardId: 'us-gb-233',
    name: { en: 'Dylan', pt: 'Daniel' },
    gender: 'boy',
    height: 109,
    color: '#41a00b',
  },
  {
    id: 4,
    cardId: 'us-gb-234',
    name: { en: 'Sandy', pt: 'Sabrina' },
    gender: 'girl',
    height: 100,
    color: '#962196',
  },
  {
    id: 5,
    cardId: 'us-gb-235',
    name: { en: 'Brent', pt: 'Breno' },
    gender: 'boy',
    height: 122,
    color: '#e54122',
  },
  {
    id: 6,
    cardId: 'us-gb-236',
    name: { en: 'Alice', pt: 'Alice' },
    gender: 'girl',
    height: 117,
    color: '#ffd800',
  },
  {
    id: 7,
    cardId: 'us-gb-237',
    name: { en: 'Isaac', pt: 'Igor' },
    gender: 'boy',
    height: 127,
    color: 'white',
  },
  {
    id: 8,
    cardId: 'us-gb-238',
    name: { en: 'Anna', pt: 'Aninha' },
    gender: 'girl',
    height: 104,
    color: 'orange',
  },
  {
    id: 9,
    cardId: 'us-gb-239',
    name: { en: 'Linus', pt: 'Lino' },
    gender: 'boy',
    height: 112,
    color: 'teal',
  },
  {
    id: 10,
    cardId: 'us-gb-240',
    name: { en: 'Matilda', pt: 'Matilda' },
    gender: 'girl',
    height: 115,
    color: 'brown',
  },
];

const HEIGHT_THRESHOLDS = ALL_KIDS.map((k) => k.height).sort();

const getNeighbors = (kid: Kid, allKids: Kid[]) => {
  const index = allKids.findIndex((k) => k.id === kid.id);
  const left = allKids[(index - 1 + allKids.length) % allKids.length];
  const right = allKids[(index + 1) % allKids.length];
  return { left, right };
};

const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const STATEMENT_POOL: StatementDef[] = [
  {
    // 0: <character> did it
    difficultyWeight: 1,
    generateParam: (speaker, allKids) => pickRandom(allKids.filter((k) => k.id !== speaker.id)).id,
    build: (_, allKids, param) => {
      const target = allKids.find((k) => k.id === param)!;
      return {
        text: {
          en: `${target.name.en} did it`,
          pt: `Foi ${target.gender === 'boy' ? 'o' : 'a'} ${target.name.pt}!`,
        },
        evaluate: (ctx) => ctx.culprits.some((c) => c.id === target.id),
      };
    },
  },
  {
    // 1: <character> didn't do it
    difficultyWeight: 1,
    generateParam: (speaker, allKids) => pickRandom(allKids.filter((k) => k.id !== speaker.id)).id,
    build: (_, allKids, param) => {
      const target = allKids.find((k) => k.id === param)!;
      return {
        text: {
          en: `${target.name.en} didn't do it`,
          pt: `Não foi ${target.gender === 'boy' ? 'o' : 'a'} ${target.name.pt}`,
        },
        evaluate: (ctx) => !ctx.culprits.some((c) => c.id === target.id),
      };
    },
  },
  {
    // 2: <character> is lying
    difficultyWeight: 2,
    generateParam: (speaker, allKids) => pickRandom(allKids.filter((k) => k.id !== speaker.id)).id,
    build: (_, allKids, param) => {
      const target = allKids.find((k) => k.id === param)!;
      return {
        text: { en: `${target.name.en} is lying`, pt: `${target.name.pt} tá mentindo` },
        evaluate: (ctx) => ctx.liars.some((l) => l.id === target.id),
      };
    },
  },
  {
    // 3: <character> or I did it (or both)
    difficultyWeight: 3,
    generateParam: (speaker, allKids) => pickRandom(allKids.filter((k) => k.id !== speaker.id)).id,
    build: (speaker, allKids, param) => {
      const target = allKids.find((k) => k.id === param)!;
      return {
        text: {
          en: `${target.name.en} or I did it`,
          pt: `Foi ${target.gender === 'boy' ? 'o' : 'a'} ${target.name.pt} ou eu `,
        },
        evaluate: (ctx) => ctx.culprits.some((c) => c.id === target.id || c.id === speaker.id),
      };
    },
  },
  {
    // 4: A boy did it
    difficultyWeight: 2,
    generateParam: () => undefined,
    build: () => ({
      text: { en: 'A boy did it', pt: 'Foi um menino' },
      evaluate: (ctx) => ctx.culprits.some((c) => c.gender === 'boy'),
    }),
  },
  {
    // 5: A girl did it
    difficultyWeight: 2,
    generateParam: () => undefined,
    build: () => ({
      text: { en: 'A girl did it', pt: 'Foi uma menina' },
      evaluate: (ctx) => ctx.culprits.some((c) => c.gender === 'girl'),
    }),
  },
  {
    // 6: Someone taller than me did it
    difficultyWeight: 3,
    generateParam: () => undefined,
    build: (speaker) => ({
      text: { en: 'Someone taller than me did it', pt: 'Foi alguém mais alto que eu' },
      evaluate: (ctx) => ctx.culprits.some((c) => c.height > speaker.height),
    }),
  },
  {
    // 7: Someone shorter than N cm did it
    difficultyWeight: 3,
    generateParam: () => pickRandom(HEIGHT_THRESHOLDS),
    build: (_, __, param) => ({
      text: {
        en: `Someone shorter than ${param} cm did it`,
        pt: `Foi alguém menor que ${param} cm`,
      },
      evaluate: (ctx) => ctx.culprits.some((c) => c.height < param!),
    }),
  },
  {
    // 8: A suspect next to me did it
    difficultyWeight: 3,
    generateParam: () => undefined,
    build: (speaker, allKids) => ({
      text: { en: 'Someone next to me did it', pt: 'Foi alguém do meu lado' },
      evaluate: (ctx) => {
        const { left, right } = getNeighbors(speaker, allKids);
        return ctx.culprits.some((c) => c.id === left.id || c.id === right.id);
      },
    }),
  },
  {
    // 9: The culprit has a different gender than me
    difficultyWeight: 3,
    generateParam: () => undefined,
    build: (speaker) => ({
      text: {
        en: 'The culprit has a different gender than me',
        pt: 'Quem pegou é de um gênero diferente do meu',
      },
      evaluate: (ctx) => ctx.culprits.some((c) => c.gender !== speaker.gender),
    }),
  },
];

function getCombinations<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  function combine(start: number, combo: T[]) {
    if (combo.length === size) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < array.length; i++) {
      combine(i + 1, [...combo, array[i]]);
    }
  }
  combine(0, []);
  return result;
}

// --- ID Encoding / Decoding ---
function encodePuzzleId(
  numKids: number,
  numCulprits: number,
  exactLiars: number,
  stmts: StatementInstance[],
): string {
  const stmtString = stmts
    .map((s) => (s.param !== undefined ? `${s.type},${s.param}` : `${s.type}`))
    .join('-');
  const rawId = `${numKids}|${numCulprits}|${exactLiars}|${stmtString}`;
  return globalThis.btoa(rawId);
}

function decodePuzzleId(hash: string) {
  const rawId = globalThis.atob(hash);
  const [kidsStr, culpritsStr, liarsStr, stmtsStr] = rawId.split('|');
  const numKids = Number.parseInt(kidsStr, 10);
  const numCulprits = Number.parseInt(culpritsStr, 10);
  const exactLiars = Number.parseInt(liarsStr, 10);

  const parsedStmts = stmtsStr.split('-').map((s) => {
    const [typeStr, paramStr] = s.split(',');
    return {
      type: Number.parseInt(typeStr, 10),
      param: paramStr ? Number.parseInt(paramStr, 10) : undefined,
    };
  });

  return { numKids, numCulprits, exactLiars, parsedStmts };
}

// --- Difficulty Calculator ---
function calculateDifficulty(
  numKids: number,
  numCulprits: number,
  exactLiars: number,
  stmts: StatementInstance[],
): number {
  // Max ~20 points based on number of kids (3 kids = 0, 7 kids = 20)
  const kidsScore = (numKids - 3) * 5;

  // Max ~30 points based on culprits (1 culprit = 0, 3 culprits = 30)
  const culpritsScore = (numCulprits - 1) * 15;

  // Max ~20 points based on liars (0 liars = 0, 4 liars = 20)
  const liarsScore = exactLiars * 5;

  // Max ~30 points based on statement complexity
  const totalWeight = stmts.reduce((sum, stmt) => sum + STATEMENT_POOL[stmt.type].difficultyWeight, 0);
  const avgWeight = totalWeight / stmts.length; // Range: 1.0 to 3.0
  const statementsScore = (avgWeight - 1) * 15; // Range: 0 to 30

  const totalScore = Math.round(kidsScore + culpritsScore + liarsScore + statementsScore);

  // Clamp between 1 and 100 just in case
  return Math.max(1, Math.min(100, totalScore));
}

// --- Puzzle Solvers ---

function solvePuzzle(
  activeKids: Kid[],
  numCulprits: number,
  exactLiars: number,
  statements: { kid: Kid; stmt: StatementInstance }[],
) {
  const possibleCulpritCombos = getCombinations(activeKids, numCulprits);
  const possibleLiarCombos = getCombinations(activeKids, exactLiars);

  let validSolutionsCount = 0;
  let finalCulprits: Kid[] = [];
  let finalLiars: Kid[] = [];

  for (const testCulprits of possibleCulpritCombos) {
    for (const testLiars of possibleLiarCombos) {
      let isValidState = true;
      for (const ks of statements) {
        const isLiarInThisState = testLiars.some((l) => l.id === ks.kid.id);
        const statementWouldBeTrue = ks.stmt.evaluate({
          speaker: ks.kid,
          allKids: activeKids,
          culprits: testCulprits,
          liars: testLiars,
        });

        if ((isLiarInThisState && statementWouldBeTrue) || (!isLiarInThisState && !statementWouldBeTrue)) {
          isValidState = false;
          break;
        }
      }
      if (isValidState) {
        validSolutionsCount++;
        finalCulprits = testCulprits;
        finalLiars = testLiars;
      }
    }
  }

  return { validSolutionsCount, finalCulprits, finalLiars };
}

// --- Main Exits ---

export function generatePuzzle(
  numKids: number,
  numCulprits: number,
  exactLiars: number,
  avoidIds: string[] = [],
): DailyPirralhosEntry {
  const activeKids = sampleSize(ALL_KIDS, numKids);
  const possibleCulpritCombos = getCombinations(activeKids, numCulprits);
  const possibleLiarCombos = getCombinations(activeKids, exactLiars);

  let attempts = 0;

  while (attempts < 5000) {
    attempts++;
    const trueCulprits = pickRandom(possibleCulpritCombos);
    const trueLiars = pickRandom(possibleLiarCombos);

    const kidStatements = activeKids.map((kid) => {
      let stmtInstance: StatementInstance | null = null;
      let isValid = false;

      while (!isValid) {
        const typeIndex = Math.floor(Math.random() * STATEMENT_POOL.length);
        const def = STATEMENT_POOL[typeIndex];
        const param = def.generateParam(kid, activeKids);
        const built = def.build(kid, activeKids, param);

        stmtInstance = { type: typeIndex, param, ...built };

        const isLiar = trueLiars.some((l) => l.id === kid.id);
        const statementIsActuallyTrue = stmtInstance.evaluate({
          speaker: kid,
          allKids: activeKids,
          culprits: trueCulprits,
          liars: trueLiars,
        });

        if ((isLiar && !statementIsActuallyTrue) || (!isLiar && statementIsActuallyTrue)) {
          isValid = true;
        }
      }
      return { kid, stmt: stmtInstance! };
    });

    const statementTexts = kidStatements.map((ks) => ks.stmt.text.en);
    if (new Set(statementTexts).size !== activeKids.length) {
      continue;
    }

    const solution = solvePuzzle(activeKids, numCulprits, exactLiars, kidStatements);

    if (solution.validSolutionsCount === 1) {
      const stmtInstances = kidStatements.map((ks) => ks.stmt);
      const puzzleId = encodePuzzleId(numKids, numCulprits, exactLiars, stmtInstances);

      if (avoidIds.includes(puzzleId)) {
        continue;
      }

      const difficulty = calculateDifficulty(numKids, numCulprits, exactLiars, stmtInstances);

      return {
        id: puzzleId,
        type: 'pirralhos',
        number: 0,
        kids: kidStatements.map((ks) => ({ ...ks.kid, statement: ks.stmt.text })),
        culpritsIds: trueCulprits.map((c) => c.cardId),
        liarsIds: trueLiars.map((l) => l.cardId),
        possibleLiars: exactLiars,
        difficulty,
      };
    }
  }

  throw new Error('Could not generate a unique puzzle after 5000 attempts. Try adjusting the parameters.');
}

export function getPuzzleById(hashId: string): DailyPirralhosEntry {
  const { numKids, numCulprits, exactLiars, parsedStmts } = decodePuzzleId(hashId);
  const activeKids = ALL_KIDS.slice(0, numKids);

  const kidStatements = activeKids.map((kid, index) => {
    const parsed = parsedStmts[index];
    const built = STATEMENT_POOL[parsed.type].build(kid, activeKids, parsed.param);
    return {
      kid,
      stmt: { type: parsed.type, param: parsed.param, ...built },
    };
  });

  const solution = solvePuzzle(activeKids, numCulprits, exactLiars, kidStatements);

  if (solution.validSolutionsCount !== 1) {
    throw new Error('Invalid puzzle ID provided. Puzzle does not have a unique solution.');
  }

  const stmtInstances = kidStatements.map((ks) => ks.stmt);
  const difficulty = calculateDifficulty(numKids, numCulprits, exactLiars, stmtInstances);

  return {
    id: hashId,
    type: 'pirralhos',
    number: 0,
    kids: kidStatements.map((ks) => ({ ...ks.kid, statement: ks.stmt.text })),
    culpritsIds: solution.finalCulprits.map((c) => c.cardId),
    liarsIds: solution.finalLiars.map((l) => l.cardId),
    possibleLiars: exactLiars,
    difficulty,
  };
}
