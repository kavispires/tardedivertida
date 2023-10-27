import { Button } from 'antd';
import { useQuery } from 'react-query';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { firestore } from 'services/firebase';

interface Games {
  [key: string]: {
    [key: string]: {
      store: PlainObject;
      state: PlainObject;
    };
  };
}

export function SaveGames() {
  const q = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/back-up/games.json`);
      return response.json();
    },
    onSuccess: async (data) => {
      // Object.entries(data).forEach(([gameName, games]) => {
      //   Object.entries(games as PlainObject).forEach(async ([gameId, session]) => {
      //     await setDoc(doc(firestore, 'games', gameName, gameId, 'state'), session.state);
      //     await setDoc(doc(firestore, 'games', gameName, gameId, 'store'), session.store);
      //   });
      // });
      // console.log('done!');
    },
    enabled: false,
  });

  return (
    <div>
      <Button onClick={() => q.refetch()} loading={q.isLoading} disabled>
        Override all games
      </Button>
    </div>
  );
}
