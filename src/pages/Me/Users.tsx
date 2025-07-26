import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { cloneDeep, merge } from 'lodash';
import { useMemo, useState } from 'react';
import { useTitle } from 'react-use';
// Ant Design Resources
import { App, Button, Input, Select, Space, Typography } from 'antd';
// Services
import { USER_API, USER_API_ACTIONS } from 'services/adapters';
import { firestore } from 'services/firebase';
// Components
import { PageLayout } from 'components/layout/PageLayout';
// Sass
import './Me.scss';
// Components

interface GameUserEntry {
  gameName?: GameName;
  gameId: GameId;
  startedAt: number;
  endedAt: number;
  playerCount: number;
  placement: number;
  win?: boolean;
  last?: boolean;
  achievements: AchievementKey[];
}

type AvatarId = string;
type AchievementKey = string;
type GameName = string;
type DailyEntry = {
  id: string; // Format YYYY-MM-DD
  number: number;
  victory: boolean;
  hearts: number;
  letters: string[];
};

/**
 * User database structure saved in Firestore
 */
interface FirebaseUserDB {
  id: string;
  isAdmin?: boolean;
  isGuest?: boolean;
  preferredLanguage: Language;
  names: string[]; // unique list but most recent comes last
  gender?: string;
  avatars: Record<AvatarId, number>;
  ratings: Record<GameName, number>;
  games: Record<GameName, Record<GameId, GameUserEntry>>;
  blurredImages: Record<ImageCardId, true>;
  daily: Record<CardId, DailyEntry>;
}

const DEFAULT_FIREBASE_USER_DB: FirebaseUserDB = {
  id: '',
  names: [],
  avatars: {},
  preferredLanguage: 'en',
  games: {},
  gender: 'unknown',
  ratings: {},
  blurredImages: {},
  daily: {},
};

function Users() {
  useTitle('Users - Tarde Divertida');
  const { message, notification } = App.useApp();
  const queryClient = useQueryClient();

  const [selectedUserO, setSelectedUserO] = useState(DEFAULT_FIREBASE_USER_DB);
  const [selectedUserD, setSelectedUserD] = useState(DEFAULT_FIREBASE_USER_DB);

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const querySnapshot = await getDocs(
        query(collection(firestore, 'users'), where('isGuest', '!=', true)),
      );
      const result: any[] = [];
      querySnapshot.forEach((doc) => result.push(doc.data()));
      return result;
    },
  });

  const usersMutation = useMutation({
    mutationKey: ['users'],
    mutationFn: async (data: FirebaseUserDB) => {
      USER_API.run({ action: USER_API_ACTIONS.UPDATE_USER_DB, ...data });
    },
    onSuccess: () => {
      message.success('User updated');
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error',
        description: error.message,
      });
    },
  });

  const data: FirebaseUserDB[] = usersQuery.data ?? [];

  const onSelectUserO = (uid: string) => {
    setSelectedUserO(data.find((e) => e.id === uid) ?? DEFAULT_FIREBASE_USER_DB);
  };

  const onSelectUserD = (uid: string) => {
    setSelectedUserD(data.find((e) => e.id === uid) ?? DEFAULT_FIREBASE_USER_DB);
  };

  const options = data.map((entry) => (
    <Select.Option key={entry.id} value={entry.id}>
      <strong>{entry?.names?.[0]}</strong>: {entry.id}
    </Select.Option>
  ));

  const selectO = (
    <Select onChange={onSelectUserO} style={{ minWidth: 300 }}>
      {options}
    </Select>
  );

  const selectD = (
    <Select onChange={onSelectUserD} style={{ minWidth: 300 }}>
      {options}
    </Select>
  );

  const mergedUser = useMemo(
    () => merge(cloneDeep(selectedUserO ?? {}), cloneDeep(selectedUserD ?? {})),
    [selectedUserO, selectedUserD],
  );

  return (
    <PageLayout>
      <Typography.Title>Users</Typography.Title>
      {usersQuery.isLoading && <Typography.Paragraph>Loading...</Typography.Paragraph>}
      <Space className="margin" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <Space direction="vertical">
          <Typography.Title level={2}>Origin</Typography.Title>
          <Space className="margin">{selectO}</Space>
          <Typography.Paragraph>
            {selectedUserO?.names?.join(', ') ?? 'No user selected'}
          </Typography.Paragraph>
          <Input.TextArea
            value={JSON.stringify(selectedUserO ?? {}, null, 2)}
            rows={20}
            cols={50}
            className="margin"
          />
        </Space>

        <Space direction="vertical">
          <Typography.Title level={2}>Destination</Typography.Title>
          <Space className="margin">{selectD}</Space>
          <Typography.Paragraph>
            {selectedUserD?.names?.join(', ') ?? 'No user selected'}
          </Typography.Paragraph>
          <Input.TextArea
            value={JSON.stringify(selectedUserD ?? {}, null, 2)}
            rows={20}
            cols={50}
            className="margin"
          />
        </Space>
      </Space>

      <Space direction="vertical">
        <Typography.Title level={2}>Merge</Typography.Title>

        <Typography.Paragraph>{mergedUser?.names?.join(', ') ?? 'No user selected'}</Typography.Paragraph>
        <Input.TextArea
          value={JSON.stringify(mergedUser ?? {}, null, 2)}
          rows={20}
          cols={50}
          className="margin"
        />
        <Button
          type="primary"
          size="large"
          loading={usersMutation.isPending}
          onClick={() => usersMutation.mutate(mergedUser)}
          disabled={!mergedUser?.id}
        >
          Merge Users "{selectedUserO.id}" into "{selectedUserD.id}"
        </Button>
      </Space>
    </PageLayout>
  );
}

export default Users;
