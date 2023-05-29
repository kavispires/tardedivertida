import { useState } from 'react';
import { doc, getDocs, setDoc, collection } from 'firebase/firestore';
// Ant Design Resources
import { Button, Input, Layout, notification, Space, Spin } from 'antd';
// Services
import { firestore } from 'services/firebase';
// import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { ALL_USED_IDS, GAME_COLLECTION, LETTERS_EN, LETTERS_PT } from './restructure';
import { LETTERS } from 'utils/constants';

export function RestructureUI() {
  const IDS: string[] = Object.keys(ALL_USED_IDS);

  const { running, onRun, response } = useBulkSave();

  // const a = useDocumentDataOnce(doc(firestore, '_global/usedGameIds'));
  // console.log(a);

  return (
    <Layout.Content className="dev-content">
      <h2>Restructure-er</h2>
      {running && <Spin />}
      <Input.TextArea
        name="output"
        id=""
        cols={5}
        rows={5}
        readOnly
        value={JSON.stringify(response.completedIds, null, 2)}
      />
      <Input.TextArea
        name="output"
        id=""
        cols={5}
        rows={5}
        readOnly
        value={JSON.stringify(response.failedIds, null, 2)}
      />

      <Space className="space-container">
        <Button disabled={running} onClick={() => onRun(IDS)} type="primary" size="large" loading={running}>
          Bulk Save
        </Button>
      </Space>
    </Layout.Content>
  );
}

function useBulkSave() {
  const [running, setRunning] = useState(false);
  const [response, setResponse] = useState({ completedIds: [''], failedIds: [''] });

  async function onRun(gameIds: string[]) {
    setRunning(true);

    const result = await bulkSave(gameIds);
    setResponse(result);

    setRunning(false);
  }

  return {
    running,
    response,
    onRun,
  };
}

async function bulkSave(gameIds: string[]) {
  const completedIds: string[] = [];
  const failedIds: string[] = [];

  try {
    // For every id
    for (let i = 0; i < gameIds.length; i++) {
      const gameId = gameIds[i];
      const gameCode = gameId[0];
      const gameName = GAME_COLLECTION[gameCode];

      const { meta, players, store, state, isError } = await getGameData(gameName, gameId);

      if (isError) {
        failedIds.push(gameId);
        continue;
      }

      // Re-id
      const language = meta?.language ?? 'pt';
      const newId = generateGameId(gameCode, language);
      meta.gameId = state.phase !== 'GAME_OVER' ? meta.gameId : newId;

      const response = await reSave(meta, players, state, store);

      if (response) {
        failedIds.push(gameId);
        continue;
      }

      completedIds.push(gameId);
    }

    notification.info({ message: 'Complete' });
  } catch (e) {
  } finally {
    if (failedIds.length > 0) {
      notification.error({ message: failedIds });
      console.log({ failedIds });
    }
  }

  return {
    completedIds,
    failedIds,
  };
}

async function getGameData(gameName: string, gameId: string) {
  const result: PlainObject = {
    meta: {},
    players: {},
    state: {},
    store: {},
  };
  let isError = false;
  try {
    const colRef = collection(firestore, gameName, gameId, 'session');
    const querySnapshot = await getDocs(colRef);
    querySnapshot.forEach((doc) => {
      result[doc.id] = doc.data();
    });
  } catch (e) {
    console.error(e);
    isError = true;
  }

  return {
    meta: result.meta,
    players: result.players,
    state: result.state,
    store: result.store,
    isError,
  };
}

async function reSave(meta: PlainObject, players: PlainObject, state: PlainObject, store: PlainObject) {
  let isError = false;
  try {
    const { gameId, gameName } = meta;
    console.log('=====SAVING', gameId);
    if (!gameId || !gameName) {
      console.error('No gameId or gameName');
      return true;
    }

    if (!meta || !players || !state || !store) {
      console.error('Missing meta, players, state, or store');
      return true;
    }

    if (state.phase !== 'GAME_OVER') {
      console.warn('No Game Over', gameId);
      return !(await saveUnfinishedGame(meta, players, state, store));
    }

    await setDoc(doc(firestore, 'meta', gameId), {
      ...meta,
    });
    console.log('Saved meta');

    await setDoc(
      doc(firestore, 'global', 'usedGameIds'),
      {
        [gameId]: true,
      },
      { merge: true }
    );
    console.log('Saved usedId');

    await setDoc(doc(firestore, 'games', gameName, gameId, 'players'), {
      ...players,
    });
    console.log('Saved players');

    await setDoc(doc(firestore, 'games', gameName, gameId, 'state'), {
      ...state,
    });
    console.log('Saved state');

    await setDoc(doc(firestore, 'games', gameName, gameId, 'store'), {
      ...store,
    });
    console.log('Saved store');

    console.log('====DONE');

    notification.success({ message: `Created stuff for ${gameName}/${gameId}` });
  } catch (e) {
    notification.error({ message: JSON.stringify(e) });
    console.error(e);
    isError = true;
  } finally {
  }

  return isError;
}

async function saveUnfinishedGame(
  meta: PlainObject,
  players: PlainObject,
  state: PlainObject,
  store: PlainObject
) {
  try {
    await setDoc(doc(firestore, 'unfinishedGames', meta.gameId, 'session', 'players'), {
      ...players,
    });
    console.log('Saved unfinished players');

    await wait();

    await setDoc(doc(firestore, 'unfinishedGames', meta.gameId, 'session', 'state'), {
      ...state,
    });
    console.log('Saved unfinished state');

    await setDoc(doc(firestore, 'unfinishedGames', meta.gameId, 'session', 'store'), {
      ...store,
    });

    console.log('Saved unfinished store');

    await setDoc(doc(firestore, 'unfinishedGames', meta.gameId, 'session', 'meta'), {
      ...meta,
    });

    console.log('Saved unfinished meta');

    return true;
  } catch (e) {
    console.warn('Did not save unfinished game');
    return false;
  }
}

const newIdsCache: BooleanDictionary = {};

const generateGameId = (gameCode: GameCode, language: Language, length = 4): string => {
  if (!gameCode) throw Error('Missing game code');

  if (gameCode.length > 1 || !LETTERS.includes(gameCode)) throw Error('Invalid game code');

  /**
   * Generate a game id
   * @param gameCode a single capital letter
   * @param length
   * @returns
   */
  function generateId(gameCode: GameCode, length: number, language: Language): string {
    let id = `${gameCode}`;
    // Add second character based on language
    id +=
      language === 'en'
        ? LETTERS_EN[Math.floor(Math.random() * LETTERS_EN.length)]
        : LETTERS_PT[Math.floor(Math.random() * LETTERS_PT.length)];

    while (id.length < length) {
      id += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }
    return id;
  }

  let gameId: string | null = null;
  while (!gameId || newIdsCache[gameId] !== undefined) {
    gameId = generateId(gameCode, length, language);
  }
  newIdsCache[gameId] = true;

  return gameId;
};

/**
 * Function to simulate calls when developing
 * @param duration
 */
export const wait = async (duration = 1000) => {
  return await new Promise((resolve) => setTimeout(resolve, duration));
};
