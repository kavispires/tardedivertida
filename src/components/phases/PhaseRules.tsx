import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
// Ant Design Resources
import { Button, Layout, Space } from 'antd';
import { CheckCircleFilled, MehFilled, RobotFilled, SmileFilled } from '@ant-design/icons';
// Utils
import { GAME_API } from 'services/adapters';
import {
  getRandomNegativeReadyMessage,
  getRandomNeutralReadyMessage,
  getRandomPositiveReadyMessage,
  speak,
} from 'utils/speech';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
import { useUser } from 'hooks/useUser';
import { useGlobalState } from 'hooks/useGlobalState';
import { useGameId } from 'hooks/useGameId';
// Components
import { LoadingPage } from 'components/loaders';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { RulesCarousel } from '../rules';

type PhaseRulesProps = {
  players: GamePlayers;
  info: GameInfo;
};

export function PhaseRules({ players, info }: PhaseRulesProps) {
  const { isLoading } = useLoading();
  const { language, translate } = useLanguage();
  const user = useUser(players);
  const [volume] = useGlobalState('volume');
  const [, setIsAdminEnabled] = useGlobalState('isAdminEnabled');

  useEffect(() => {
    setIsAdminEnabled(true);
  }, []); // eslint-disable-line

  const gameId = useGameId();
  // TODO: check if this is working
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['meta', gameId] });
  }, [gameId]); // eslint-disable-line

  const errorMessage = translate(
    'Vixi, o aplicativo encontrou um erro ao tentar continuar',
    'Oh no! The application found an error when trying to continue'
  );

  const onBeReady = useAPICall({
    apiFunction: GAME_API.makePlayerReady,
    actionName: 'be-ready',
    successMessage: translate(
      'Pronto! Aguarde os outros jogadores estarem prontos',
      'Done! Now wait for the other players'
    ),
    errorMessage,
    onSuccess: () => {
      speak(getRandomPositiveReadyMessage(user.name), language, volume);
    },
  });

  const onBeReadyIDK = useAPICall({
    apiFunction: GAME_API.makePlayerReady,
    actionName: 'be-ready',
    successMessage: translate(
      'Pronto! Aguarde os outros jogadores estarem prontos',
      'Done! Now wait for the other players'
    ),
    errorMessage,
    onSuccess: () => {
      speak(getRandomNeutralReadyMessage(user.name), language, volume);
    },
  });

  const onBeReadyQue = useAPICall({
    apiFunction: GAME_API.makePlayerReady,
    actionName: 'be-ready',
    successMessage: translate(
      'Vixi, se fudeu então, porque o jogo vai começar!',
      'Sorry, you are screwed because the game is starting anyway!'
    ),
    errorMessage,
    onSuccess: () => {
      speak(getRandomNegativeReadyMessage(user.name), language, volume);
    },
  });

  // DEV: Auto-ready
  useMock(() => onBeReady({}), []);

  if (!info?.gameName) {
    return <LoadingPage />;
  }

  return (
    <Layout.Content className="phase-rules">
      <Title>
        <Translate pt="Regras do Jogo" en="Game Rules" />
      </Title>

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
          onClick={() => onBeReady({})}
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
          onClick={() => onBeReadyIDK({})}
          loading={isLoading}
        >
          <Translate pt="Não entendi nada, mas vamos lá!" en="I don't get it but let's go!" />
        </Button>
        <Button
          type="primary"
          danger
          icon={user.isReady ? <CheckCircleFilled /> : <RobotFilled />}
          disabled={isLoading || user.isReady}
          onClick={() => onBeReadyQue({})}
          loading={isLoading}
        >
          <Translate pt="Quê?" en="What?" />
        </Button>
      </Space>
    </Layout.Content>
  );
}
