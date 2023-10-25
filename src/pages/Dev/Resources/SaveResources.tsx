import { Button, notification } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from 'services/firebase';
import { useState } from 'react';
import { wait } from './RestructureUI';

export interface Games {
  [key: string]: {
    [key: string]: {
      store: PlainObject;
      state: PlainObject;
    };
  };
}

// const q = useQuery({
//   queryKey: 'current-library',
//   queryFn: async () => {
//     const response = await fetch(`${process.env.PUBLIC_URL}/back-up/contenders-glyphs-current.json`);
//     return response.json();
//   },
//   onSuccess: async (data) => {
//     // Object.entries(data).forEach(([gameName, games]) => {
//     //   Object.entries(games as PlainObject).forEach(async ([gameId, session]) => {
//     //     await setDoc(doc(firestore, 'games', gameName, gameId, 'state'), session.state);
//     //     await setDoc(doc(firestore, 'games', gameName, gameId, 'store'), session.store);
//     //   });
//     // });
//     // console.log('done!');
//   },
//   enabled: false,
// });

// const q2 = useQuery({
//   queryKey: 'backup-library',
//   queryFn: async () => {
//     const response = await fetch(`${process.env.PUBLIC_URL}/back-up/contenders-glyphs-backup.json`);
//     return response.json();
//   },
//   onSuccess: async (data) => {
//     console.log('here', q.data);
//     const merge = mergeContendersGlyphs(q.data, data);
//     console.log(merge);
//     await updateDoc(doc(firestore, 'data', 'contendersGlyphs'), merge);
//     api.success({ message: 'Complete' });
//   },
//   enabled: Boolean(q.data),
// });

// const q = useQuery({
//   queryKey: 'current-library',
//   queryFn: async () => {
//     const response = await fetch(`${process.env.PUBLIC_URL}/back-up/usedImageCards-current.json`);
//     return response.json();
//   },
//   onSuccess: async (data) => {
//     console.log(data);
//     api.info({ message: 'Loaded current' });
//   },
//   enabled: false,
// });

// const q2 = useQuery({
//   queryKey: 'backup-library',
//   queryFn: async () => {
//     const response = await fetch(`${process.env.PUBLIC_URL}/back-up/usedImageCards-backup.json`);
//     return response.json();
//   },
//   onSuccess: async (data) => {
//     api.info({ message: 'Loaded backup' });

//     if (!ranOnce && q.data && data) {
//       const result = { ...data, ...q.data };
//       console.log(result);
//       // await updateDoc(doc(firestore, 'global', 'usedImageCards'), result);
//       setRanOnce(true);
//       api.success({ message: 'Complete' });
//     }
//   },
//   enabled: Boolean(q.data),
// });

// DRAWINGS
// const q = useQuery({
//   queryKey: 'cards-library',
//   queryFn: async () => {
//     const response = await fetch('https://www.kavispires.com/tdr/resources/arte-ruim-cards-pt.json');
//     return response.json();
//   },
//   onSuccess: async (data) => {
//     console.log(data);
//     api.info({ message: 'Loaded current' });
//   },
//   enabled: false,
// });

// const q2 = useQuery({
//   queryKey: 'current-library',
//   queryFn: async () => {
//     const response = await fetch(`${process.env.PUBLIC_URL}/back-up/dataDrawings.json`);
//     return response.json();
//   },
//   onSuccess: async (data) => {
//     if (!ranOnce && q.data && data) {
//       console.log(data);
//       const cards = q.data;
//       api.info({ message: 'Loaded current' });
//       const keys = Object.keys(data);

//       const existChecks: BooleanDictionary = {};

//       for (const key of keys) {
//         const language = key.includes('pt') ? 'PT' : 'EN';
//         const library = `drawings${language}`;

//         const entry = data[key];
//         if (data && entry.text === '?') {
//           entry.text = cards[entry.cardId].text;
//           // console.count('Skip');
//           // continue;
//         }
//         console.log(entry.cardId);
//         const suffixKey = language === 'PT' ? 'drawingsPT' : 'drawingsEN';
//         let tries = 0;
//         let done = false;
//         while (tries < 2 && !done && globalTries < 10_000) {
//           const suffix = suffixCounts[suffixKey];
//           const documentName = `${library}${suffix}`;
//           try {
//             if (existChecks[documentName]) {
//               console.log('try to update', documentName);
//               await updateDoc(doc(firestore, 'data', documentName), { [key]: entry });
//             } else {
//               console.log('trying to set', documentName);
//               await setDoc(doc(firestore, 'data', documentName), { [key]: entry });
//               existChecks[documentName] = true;
//             }
//             await wait(Math.random() * 250);
//             console.log({
//               document: documentName,
//               exist: existChecks[documentName],
//               cardId: entry.cardId,
//               tries,
//             });
//             done = true;
//           } catch (_) {
//             console.log('FAILED on', suffix);
//             suffixCounts[suffixKey] += 1;
//             tries++;
//           }

//           globalTries++;
//         }

//         console.log('DONE_IN', tries);
//       }

//       console.log({ suffixCounts });
//       setRanOnce(true);
//       api.success({ message: 'Complete' });
//     }
//   },
//   enabled: Boolean(q.data),
// });

const suffixCounts = {
  drawingsEN: 1,
  drawingsPT: 1,
  monsterDrawings: 1,
};

let globalTries = 0;

export function SaveResources() {
  const [api, contextHolder] = notification.useNotification();
  const [ranOnce, setRanOnce] = useState(false);

  const q = useQuery({
    queryKey: ['current-library'],
    queryFn: async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/back-up/dataMonsterDrawings.json`);
      return response.json();
    },
    onSuccess: async (data) => {
      if (!ranOnce && data) {
        console.log(data);
        api.info({ message: 'Loaded current' });
        const keys = Object.keys(data);

        const existChecks: BooleanDictionary = {};

        for (const key of keys) {
          const library = 'monsterDrawings';

          let tries = 0;
          let done = false;
          const [id, playerId] = key.split('::');
          const entry = {
            playerId,
            id,
            drawing: data[key],
          };
          console.log({ entry });
          while (tries < 2 && !done && globalTries < 10_000) {
            const suffix = suffixCounts[library];
            const documentName = `${library}${suffix}`;
            try {
              if (existChecks[documentName]) {
                console.log('try to update', documentName);
                await updateDoc(doc(firestore, 'data', documentName), { [key]: entry });
              } else {
                console.log('trying to set', documentName);
                await setDoc(doc(firestore, 'data', documentName), { [key]: entry });
                existChecks[documentName] = true;
              }
              await wait(Math.random() * 250);
              console.log({
                document: documentName,
                exist: existChecks[documentName],
                cardId: entry.id,
                tries,
              });
              done = true;
            } catch (_) {
              console.log('FAILED on', suffix);
              suffixCounts[library] += 1;
              tries++;
            }

            globalTries++;
          }

          console.log('DONE_IN', tries);
        }

        console.log({ suffixCounts });
        setRanOnce(true);
        api.success({ message: 'Complete' });
      }
    },
    enabled: false,
  });

  return (
    <div>
      {contextHolder}
      <Button onClick={() => q.refetch()} loading={q.isLoading}>
        RUN
      </Button>

      {/* <Space wrap>
        {Object.entries(q2.data ?? {})
          .filter(([key, e]) => {
            const entry = e as PlainObject;
            return entry.cardId.includes('pt');
            // return false;
          })
          .map(([key, e]) => {
            const entry = e as PlainObject;
            return (
              <Space direction="vertical">
                <Canvas drawing={entry.drawing} key={key} />
                <p>
                  {entry.text} {key}
                </p>
              </Space>
            );
          })}
      </Space> */}
    </div>
  );
}

type ImageCardsStories = Record<ImageCardId, string[]>;

export function mergeImageCardsStoriesEn(current: ImageCardsStories, backup: ImageCardsStories) {
  Object.entries(backup).forEach(([cardId, words]) => {
    if (current[cardId]) {
      current[cardId] = [...current[cardId], ...words];
    } else {
      current[cardId] = words;
    }
  });
  return current;
}

type ContendersGlyphs = Record<CardId, BooleanDictionary>;

export function mergeContendersGlyphs(current: ContendersGlyphs, backup: ContendersGlyphs) {
  Object.entries(backup).forEach(([cardId, glyphs]) => {
    if (current[cardId]) {
      current[cardId] = { ...current[cardId], ...glyphs };
    } else {
      current[cardId] = glyphs;
    }
  });
  return current;
}
