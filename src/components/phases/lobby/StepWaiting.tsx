import { useMutation } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { useEffect } from 'react';
// Ant Design Resources
import { App, Tag, Typography } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useGameMeta } from 'hooks/useGameMeta';
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Services
import { HOST_API, HOST_API_ACTIONS } from 'services/adapters';
// Utils
import { AVATARS } from 'utils/avatars';
// Components
import { HostButton, HostOnlyContainer } from 'components/host';
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { useGameInfoContext } from 'components/session/GameInfoContext';
// Internal
import { Settings } from './Settings';
// Images
import avatars from 'assets/images/avatars.svg?url';

const Title = motion.create(Typography.Title);
const Paragraph = motion.create(Typography.Paragraph);

type StepWaitingProps = {
  players: GamePlayers;
};

export function StepWaiting({ players }: StepWaitingProps) {
  const info = useGameInfoContext();
  const { message, notification } = App.useApp();
  const { meta: gameMeta } = useGameMeta();
  const { translate } = useLanguage();
  const { isLoading, setLoader } = useLoading();

  const [username] = useGlobalState('username');
  const [userAvatarId] = useGlobalState('userAvatarId');

  const { mutate, isPending: isLocking } = useMutation({
    mutationKey: ['lock-game'],
    mutationFn: async () => {
      setLoader('lock-game', true);
      return await HOST_API.run({
        action: HOST_API_ACTIONS.LOCK_GAME,
        gameId: gameMeta.gameId,
        gameName: gameMeta.gameName,
      });
    },
    onSuccess: (response) => {
      const data = response.data as PlainObject;

      if (data.isLocked) {
        message.success(
          translate('Jogo trancado e iniciado com sucesso!', 'Game locked and initialized successfully'),
        );
      }
    },
    onError: (e: Error) => {
      notification.error({
        title: translate(
          'Vixi, o aplicativo encontrou um erro ao tentar trancar e iniciar o jogo',
          'Oops, the application found an error while trying to lock and start the game',
        ),
        description: JSON.stringify(e.message),
        placement: 'bottomLeft',
      });
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.error(e);
    },
    onSettled: () => {
      setLoader('lock-game', false);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: it should trigger only when the isLocking changes
  useEffect(() => {
    setLoader('lock-game', isLocking);

    return () => {
      setLoader('lock-game', false);
    };
  }, [isLocking]);

  const numPlayers = Object.keys(players).length;
  const readyPlayers = Object.values(players).filter((player) => player.isReady).length;

  return (
    <>
      <Title
        level={2}
        className="lobby-step__title"
        layoutId="lobby-step-title"
      >
        <Translate
          pt="Pronto!"
          en="Ready!"
        />
      </Title>

      <SpaceContainer vertical>
        <motion.svg
          viewBox="0 0 100 100"
          className="lobby-avatar"
          layoutId="avatar"
        >
          <use href={`${avatars}#avatar-${userAvatarId}`}></use>
        </motion.svg>

        <div className="lobby-step__description">
          <small>
            {username || translate('Fulano', 'Unknown')},{' '}
            <DualTranslate>{AVATARS[userAvatarId].description}</DualTranslate>
          </small>
        </div>
      </SpaceContainer>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Settings hasImages={info.tags.includes('images')} />
        <Paragraph className="lobby-heading">
          <Translate
            pt="Aguarde os outros jogadores entrarem."
            en="Please, wait while other players join..."
          />
        </Paragraph>
        <HostOnlyContainer
          className="lobby-waiting__lock-button"
          orientation="vertical"
        >
          <Typography.Text className="center padding">
            <Translate
              pt="Jogadores necessários"
              en="Players needed"
            />
            :{' '}
            <Tag>
              {numPlayers}/{gameMeta.min}
            </Tag>{' '}
            <Translate
              pt="Prontos"
              en="Ready"
            />
            :{' '}
            <Tag>
              {readyPlayers}/{numPlayers}
            </Tag>
          </Typography.Text>
          <HostButton
            onClick={() => mutate()}
            disabled={isLoading || numPlayers < gameMeta.min}
            loading={isLoading}
            block
          >
            <Translate
              pt="Trancar e Iniciar Jogo"
              en="Lock and Start Game"
            />
          </HostButton>
        </HostOnlyContainer>
      </motion.div>
    </>
  );
}
