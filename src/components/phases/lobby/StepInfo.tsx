import { useEffect, useState } from 'react';
// Ant Design Resources
import { Alert, AutoComplete, Button } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
import type { GamePlayers } from 'types/player';
// API & Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useAddPlayer } from 'hooks/useAddPlayer';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { UseStep } from 'hooks/useStep';
// Utils
import { AVAILABLE_AVATAR_IDS } from 'utils/avatars';
import { getRandomItem, isDevEnv } from 'utils/helpers';
import { mockPlayerName } from 'mock/players';
// Components
import { Translate } from 'components/language';
import { AvatarSelection } from './AvatarSelection';
import { Settings } from './Settings';
import { UsualAvatarsSelection } from './UsualAvatarsSelection';

const randomName = isDevEnv ? mockPlayerName() : undefined;

type StepInfoProps = {
  info: GameInfo;
  players: GamePlayers;
  setStep: UseStep['setStep'];
};

export function StepInfo({ info, players, setStep }: StepInfoProps) {
  const { currentUser, isGuest } = useCurrentUserContext();
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentUser?.avatars?.[0] ?? getRandomItem(AVAILABLE_AVATAR_IDS)
  );

  const [name, setName] = useState((currentUser?.names ?? []).at(-1) ?? '');
  const [getLocalStorage] = useLocalStorage();

  // Load username and avatar from localStorage if any
  useEffect(() => {
    const lsAvatarId = getLocalStorage('avatarId');
    const lsUsername = getLocalStorage('username');

    if (isGuest) {
      if (lsAvatarId) {
        setSelectedAvatar(lsAvatarId);
      }

      if (lsUsername) {
        setName(lsUsername ?? '');
      }
    }
  }, [isGuest]); // eslint-disable-line

  const { isLoading, mutate } = useAddPlayer(name, selectedAvatar, isGuest, () => setStep(2));

  const hasPlayedBefore = Boolean(currentUser.games?.[info.gameName]);

  const nameOptions = (currentUser?.names ?? []).map((name) => ({ value: name }));

  return (
    <>
      <h1 className="lobby-step__title">
        <Translate pt="Adicione seus dados" en="Add your info" />
      </h1>

      {hasPlayedBefore && (
        <Alert
          type="info"
          message={<Translate pt="Você jogou esse jogo anteriormente" en="You played this game before" />}
          className="margin"
        />
      )}

      <AvatarSelection
        players={players}
        setSelectedAvatar={setSelectedAvatar}
        selectedAvatar={selectedAvatar}
        userId={currentUser.id}
      />

      {currentUser && currentUser.avatars.length > 0 && (
        <UsualAvatarsSelection avatarsIds={currentUser.avatars} setSelectedAvatar={setSelectedAvatar} />
      )}

      <AutoComplete
        className="lobby-step__name-input"
        options={nameOptions}
        onChange={(value) => setName(value.trim())}
        onSelect={(value) => setName(value.trim())}
        placeholder="input here"
        maxLength={10}
        value={name || randomName}
      />

      <Settings hasImages={info.tags.includes('images')} />

      <Button
        block
        loading={isLoading}
        disabled={!name || !selectedAvatar}
        type="primary"
        onClick={() => mutate()}
      >
        <Translate pt="Entrar" en="Enter" />
      </Button>
    </>
  );
}
