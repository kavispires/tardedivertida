import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { CheckCircleFilled, MehFilled, RobotFilled, SmileFilled } from '@ant-design/icons';
import { Button, Flex } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
import { useGlobalState } from 'hooks/useGlobalState';
import { useHost } from 'hooks/useHost';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useUser } from 'hooks/useUser';
// Services
import { GAME_API_COMMON_ACTIONS } from 'services/adapters';
// Utils
import {
  getRandomNegativeReadyMessage,
  getRandomNeutralReadyMessage,
  getRandomPositiveReadyMessage,
  speak,
} from 'utils/speech';
// Components
import { Translate } from 'components/language';

type LobbyReadyButtonsProps = {
  players: GamePlayers;
};

export function LobbyReadyButtons({ players }: LobbyReadyButtonsProps) {
  const { isLoading } = useLoading();
  const { language, translate } = useLanguage();
  const user = useUser(players);
  const [volume] = useGlobalLocalStorage('volume');
  const [, setIsAdminEnabled] = useGlobalState('isAdminEnabled');
  const isHost = useHost();

  useEffectOnce(() => {
    setIsAdminEnabled(true);
  });

  const errorMessage = translate(
    'Vixi, o aplicativo encontrou um erro ao tentar continuar',
    'Oh no! The application found an error when trying to continue',
  );

  const onBeReady = useGameActionRequest({
    actionName: 'be-ready',
    successMessage: translate(
      'Pronto! Aguarde os outros jogadores estarem prontos',
      'Done! Now wait for the other players',
    ),
    errorMessage,
    onSuccess: () => {
      speak(getRandomPositiveReadyMessage(user.name), language, volume);
    },
  });

  const onBeReadyIDK = useGameActionRequest({
    actionName: 'be-ready',
    successMessage: translate(
      'Pronto! Aguarde os outros jogadores estarem prontos',
      'Done! Now wait for the other players',
    ),
    errorMessage,
    onSuccess: () => {
      speak(getRandomNeutralReadyMessage(user.name), language, volume);
    },
  });

  const onBeReadyQue = useGameActionRequest({
    actionName: 'be-ready',
    successMessage: translate(
      'Vixi, se fudeu então, porque o jogo vai começar!',
      'Sorry, you are screwed because the game is starting anyway!',
    ),
    errorMessage,
    onSuccess: () => {
      speak(getRandomNegativeReadyMessage(user.name), language, volume);
    },
  });

  return (
    <Flex
      gap={6}
      justify="center"
      align="center"
      wrap="wrap"
    >
      <Button
        type="primary"
        size="small"
        icon={user.isReady ? <CheckCircleFilled /> : <SmileFilled />}
        disabled={isLoading || user.isReady || isHost}
        onClick={() => onBeReady({ action: GAME_API_COMMON_ACTIONS.MAKE_ME_READY })}
        loading={isLoading}
      >
        <Translate
          pt="Entendi tudo e estou pronto para jogar!"
          en="I understood everything and I'm ready to play!"
        />
      </Button>
      <Button
        size="small"
        icon={user.isReady ? <CheckCircleFilled /> : <MehFilled />}
        disabled={isLoading || user.isReady || isHost}
        onClick={() => onBeReadyIDK({ action: GAME_API_COMMON_ACTIONS.MAKE_ME_READY })}
        loading={isLoading}
      >
        <Translate
          pt="Não entendi nada, mas vamos lá!"
          en="I don't get it but let's go!"
        />
      </Button>
      <Button
        type="primary"
        size="small"
        danger
        icon={user.isReady ? <CheckCircleFilled /> : <RobotFilled />}
        disabled={isLoading || user.isReady || isHost}
        onClick={() => onBeReadyQue({ action: GAME_API_COMMON_ACTIONS.MAKE_ME_READY })}
        loading={isLoading}
      >
        <Translate
          pt="Quê?"
          en="What?"
        />
      </Button>
    </Flex>
  );
}
