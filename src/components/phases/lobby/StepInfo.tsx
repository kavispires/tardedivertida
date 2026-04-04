import { mockPlayerName } from 'mock/players';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
// Ant Design Resources
import { Alert, AutoComplete, Button, Typography } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useAddPlayer } from 'hooks/useAddPlayer';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Utils
import { AVAILABLE_AVATAR_IDS } from 'utils/avatars';
import { getRandomItem, isDevEnv } from 'utils/helpers';
// Components
import { Translate } from 'components/language/Translate';
import { useGameInfoContext } from 'components/session/GameInfoContext';
// Internal
import { AvatarSelection } from './AvatarSelection';
import { Settings } from './Settings';
import { UsualAvatarsSelection } from './UsualAvatarsSelection';
// Sass
import styles from '../PhaseLobby.module.scss';

const Title = motion.create(Typography.Title);

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
      <Title
        level={2}
        className={styles.lobbyStepTitle}
        layoutId="lobby-step-title"
      >
        <Translate
          pt="Adicione seus dados"
          en="Add your info"
        />
      </Title>

      {hasPlayedBefore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Alert
            type="info"
            title={
              <Translate
                pt="Você jogou esse jogo anteriormente"
                en="You played this game before"
              />
            }
            banner
            className="mt-0 mb-4"
          />
        </motion.div>
      )}

      <AvatarSelection
        players={players}
        setSelectedAvatar={setSelectedAvatar}
        selectedAvatar={selectedAvatar}
        userId={currentUser.id}
        maxPlayers={info.playerCount.max ?? 10}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {currentUser?.avatars.length > 0 && (
          <UsualAvatarsSelection
            avatarsIds={currentUser.avatars}
            setSelectedAvatar={setSelectedAvatar}
          />
        )}

        <AutoComplete
          className={styles.lobbyStepNameInput}
          options={nameOptions}
          onChange={(value) => setName(value.trim())}
          onSelect={(value) => setName(value.trim())}
          placeholder={translate('Digite seu nome', 'Type your name')}
          maxLength={10}
          value={name || randomName}
        />

        <Settings hasImages={info.mechanics.includes('images')} />

        <Button
          block
          loading={isPending}
          disabled={!name || !selectedAvatar}
          type="primary"
          onClick={() => mutate()}
        >
          <Translate
            pt="Entrar"
            en="Enter"
          />
        </Button>
      </motion.div>
    </>
  );
}
