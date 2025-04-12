import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { CheckCircleFilled, MehFilled, RobotFilled, SmileFilled } from '@ant-design/icons';
import { Button, Layout, Space } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
import type { GamePlayers } from 'types/player';
// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useGameId } from 'hooks/useGameId';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
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
import { LoadingPage } from 'components/loaders';
import { useGameInfoContext } from 'components/session/GameInfoContext';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import { RulesCarousel } from '../rules';
import { AutoNextPhase } from '../general/AutoNextPhase';

type PhaseRulesProps = {
  players: GamePlayers;
  info: GameInfo;
};

/**
 * @deprecated - not part of the game anymore
 */
export function PhaseRules({ players }: PhaseRulesProps) {
  const { isLoading } = useLoading();
  const info = useGameInfoContext();
  const { language, translate } = useLanguage();
  const user = useUser(players);
  const [volume] = useGlobalLocalStorage('volume');
  const [, setIsAdminEnabled] = useGlobalState('isAdminEnabled');

  useEffectOnce(() => {
    setIsAdminEnabled(true);
  });

  const gameId = useGameId();
  // TODO: check if this is working
  const queryClient = useQueryClient();

  // biome-ignore lint/correctness/useExhaustiveDependencies: only gameId is necessary
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['meta', gameId] });
  }, [gameId]);

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

  // DEV: Auto-ready
  useMock(() => onBeReady({ action: GAME_API_COMMON_ACTIONS.MAKE_ME_READY }), [], 2);

  if (!info?.gameName) {
    return <LoadingPage />;
  }

  const backgroundColor = info.appearance?.backgroundColor;

  return (
    <Layout.Content className="phase-rules" style={backgroundColor ? { backgroundColor } : {}}>
      <StepTitle>
        <Translate pt="Regras do Jogo" en="Game Rules" />
      </StepTitle>

      <RulesCarousel
        info={info}
        className="phase-rules__carousel"
        ruleClassName="phase-rules__rule"
        actionsClassName="phase-rules__actions"
      />

      <Space className="phase-rules__actions" wrap>
        <Button
          type="primary"
          icon={user.isReady ? <CheckCircleFilled /> : <SmileFilled />}
          disabled={isLoading || user.isReady}
          onClick={() => onBeReady({ action: GAME_API_COMMON_ACTIONS.MAKE_ME_READY })}
          loading={isLoading}
        >
          <Translate
            pt="Entendi tudo e estou pronto para jogar!"
            en="I understood everything and I'm ready to play!"
          />
        </Button>
        <Button
          icon={user.isReady ? <CheckCircleFilled /> : <MehFilled />}
          disabled={isLoading || user.isReady}
          onClick={() => onBeReadyIDK({ action: GAME_API_COMMON_ACTIONS.MAKE_ME_READY })}
          loading={isLoading}
        >
          <Translate pt="Não entendi nada, mas vamos lá!" en="I don't get it but let's go!" />
        </Button>
        <Button
          type="primary"
          danger
          icon={user.isReady ? <CheckCircleFilled /> : <RobotFilled />}
          disabled={isLoading || user.isReady}
          onClick={() => onBeReadyQue({ action: GAME_API_COMMON_ACTIONS.MAKE_ME_READY })}
          loading={isLoading}
        >
          <Translate pt="Quê?" en="What?" />
        </Button>
      </Space>

      <AutoNextPhase players={players} />
    </Layout.Content>
  );
}
