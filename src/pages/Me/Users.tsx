import { useTitle } from 'react-use';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Components
import { MeContent } from './MeContent';
// Sass
import './Me.scss';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from 'services/firebase';
import { Select } from 'antd';

function Users() {
  useTitle('Users - Tarde Divertida');
  const { currentUser } = useCurrentUserContext();
  const [selectedUser, setSelectedUser] = useState(currentUser);

  // const q = useQuery({
  //   queryKey: 'users',
  //   queryFn: async () => {
  //     const querySnapshot = await getDocs(
  //       query(collection(firestore, 'users'), where('isGuest', '!=', true))
  //     );
  //     const result: any[] = [];
  //     querySnapshot.forEach((doc) => result.push(doc.data()));
  //     return result;
  //   },
  // });
  const q = { data: null };

  const data: Me[] = q.data ?? [];

  const onSelectUser = (uid: string) => {
    setSelectedUser(data.find((e) => e.id === uid) ?? currentUser);
  };

  const select = (
    <Select onChange={onSelectUser} style={{ minWidth: 300 }}>
      {data.map((entry) => (
        <Select.Option key={entry.id} value={entry.id}>
          {entry.id}
        </Select.Option>
      ))}
    </Select>
  );

  return <MeContent user={selectedUser} additionalContent={select} />;
}

export default Users;
