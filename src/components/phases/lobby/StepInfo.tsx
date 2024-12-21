import { mockPlayerName } from 'mock/players';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
// Ant Design Resources
import { Alert, AutoComplete, Button } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useAddPlayer } from 'hooks/useAddPlayer';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Utils
import { AVAILABLE_AVATAR_IDS } from 'utils/avatars';
import { getRandomItem, isDevEnv } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { useGameInfoContext } from 'components/session/GameInfoContext';
// Internal
import { AvatarSelection } from './AvatarSelection';
import { Settings } from './Settings';
import { UsualAvatarsSelection } from './UsualAvatarsSelection';

const randomName = isDevEnv ? mockPlayerName() : undefined;

type StepInfoProps = {
  players: GamePlayers;
  setStep: UseStep['setStep'];
};

export function StepInfo({ players, setStep }: StepInfoProps) {
  const { currentUser, isGuest } = useCurrentUserContext();
  const info = useGameInfoContext();
  const { translate } = useLanguage();
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentUser?.avatars?.[0] ?? getRandomItem(AVAILABLE_AVATAR_IDS),
  );

  const [name, setName] = useState((currentUser?.names ?? []).at(-1) ?? '');
  const [lsAvatarId] = useLocalStorage('username', '');
  const [lsUsername] = useLocalStorage('avatarId', '');

  // Load username and avatar from localStorage if any
  // biome-ignore lint/correctness/useExhaustiveDependencies: This is only necessary if the account is a for a guest
  useEffect(() => {
    if (isGuest) {
      if (lsAvatarId) {
        setSelectedAvatar(lsAvatarId);
      }

      if (lsUsername) {
        setName(lsUsername ?? '');
      }
    }
  }, [isGuest]);

  const { isPending, mutate } = useAddPlayer(name, selectedAvatar, isGuest, () => setStep(2));

  const hasPlayedBefore = Boolean(currentUser.games?.[info.gameName]);

  const nameOptions = (currentUser?.names ?? []).map((name) => ({
    value: name,
  }));

  return (
    <>
      <h2 className="lobby-step__title">
        <Translate pt="Adicione seus dados" en="Add your info" />
      </h2>

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
        placeholder={translate('Digite seu nome', 'Type your name')}
        maxLength={10}
        value={name || randomName}
      />

      <Settings hasImages={info.tags.includes('images')} />

      <Button
        block
        loading={isPending}
        disabled={!name || !selectedAvatar}
        type="primary"
        onClick={() => mutate()}
      >
        <Translate pt="Entrar" en="Enter" />
      </Button>
    </>
  );
}
