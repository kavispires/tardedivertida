import { useEffect, useState } from 'react';
// Ant Design Resources
import { Alert, Button, Input, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
// API & Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useAddPlayer } from 'hooks/useAddPlayer';
import { useLocalStorage } from 'hooks/useLocalStorage';
// Utils
import { AVAILABLE_AVATAR_IDS } from 'utils/avatars';
import { getRandomItem, isDevEnv } from 'utils/helpers';
import { mockPlayerName } from 'mock/players';
// Components
import { Translate } from 'components/language';
import { AvatarSelection } from './AvatarSelection';
import { Settings } from './Settings';

const randomName = isDevEnv ? mockPlayerName() : undefined;

type StepInfoProps = {
  info: GameInfo;
  players: GamePlayers;
  setStep: GenericFunction;
};

export function StepInfo({ info, players, setStep }: StepInfoProps) {
  const { currentUser, isGuest } = useCurrentUserContext();
  const { translate } = useLanguage();
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentUser.avatars?.[0] ?? getRandomItem(AVAILABLE_AVATAR_IDS)
  );
  const [name, setName] = useState((currentUser?.names ?? []).at(-1) ?? '');
  const [getLocalStorage] = useLocalStorage();

  // Load username and avatar from localStorage if any
  useEffect(() => {
    const lsAvatarId = getLocalStorage('avatarId');
    const lsUsername = getLocalStorage('username');

    if (isGuest) {
      if (lsAvatarId !== undefined) {
        setSelectedAvatar(lsAvatarId);
      }

      if (lsUsername) {
        setName(lsUsername ?? '');
      }
    }
  }, [isGuest]); // eslint-disable-line

  const { isLoading, refetch } = useAddPlayer(name, selectedAvatar, isGuest, () => setStep(2));

  const hasPlayedBefore = Boolean(currentUser.games?.[info.gameName]);

  return (
    <>
      <h1 className="lobby-step__title">
        <Translate pt="Adicione seus dados" en="Add your info" />
      </h1>

      {hasPlayedBefore && (
        <Alert
          type="info"
          message={<Translate pt="Você jogou esse jogo anteriormente" en="You played this game before" />}
        />
      )}

      <AvatarSelection
        players={players}
        setSelectedAvatar={setSelectedAvatar}
        selectedAvatar={selectedAvatar}
        userId={currentUser.id}
      />

      <Input
        className="lobby-step__name-input"
        onChange={(e) => setName(e.target.value.trim())}
        placeholder={translate('Digite seu nome', 'Insert your name')}
        value={name || randomName}
        maxLength={10}
        suffix={
          <Tooltip title={translate('Máximo de 10 caracteres', '10 characters max')}>
            <InfoCircleOutlined />
          </Tooltip>
        }
      />

      <Settings />

      <Button block disabled={isLoading} type="primary" onClick={() => refetch()}>
        <Translate pt="Entrar" en="Enter" />
      </Button>
    </>
  );
}
