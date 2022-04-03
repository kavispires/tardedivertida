// Ant Design Resources
import { Button, Layout, Space, Typography } from 'antd';
import { CheckCircleFilled, MehFilled, RobotFilled, SmileFilled } from '@ant-design/icons';
// Utils
import { GAME_API } from 'services/adapters';
import { useLoading, useIsUserReady, useAPICall, useLanguage, useMock } from 'hooks';
// Components
import { LoadingPage } from 'components/loaders';
import { Translate } from 'components/language';
import { ReadyPlayersBar } from 'components/players';
import { RulesCarousel } from '../rules';

type PhaseRulesProps = {
  players: GamePlayers;
  info: GameInfo;
};

export function PhaseRules({ players, info }: PhaseRulesProps) {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const isUserReady = useIsUserReady(players);

  const onBeReady = useAPICall({
    apiFunction: GAME_API.makePlayerReady,
    actionName: 'be-ready',
    successMessage: translate(
      'Pronto! Aguarde os outros jogadores estarem prontos',
      'Done! Now wait for the other players'
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar continuar',
      'Oh no! The application found an error when trying to continue'
    ),
  });

  const onBeReadyQue = useAPICall({
    apiFunction: GAME_API.makePlayerReady,
    actionName: 'be-ready',
    successMessage: translate(
      'Vixi, se fudeu então, porque o jogo vai começar!',
      'Sorry, you are screwed because the game is starting anyway!'
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar continuar',
      'Oh no! The application found an error when trying to continue'
    ),
  });

  // DEV: Auto-ready
  useMock(() => onBeReady({}), []);

  if (!info?.gameName) {
    return <LoadingPage />;
  }

  return (
    <Layout.Content className="phase-rules">
      <Typography.Title className="center">
        <Translate pt="Regras do Jogo" en="Game Rules" />
      </Typography.Title>

      <RulesCarousel info={info} className="phase-rules__carousel" ruleClass="phase-rules__rule" />

      <Space className="phase-rules__actions">
        <Button
          type="primary"
          icon={isUserReady ? <CheckCircleFilled /> : <SmileFilled />}
          disabled={isLoading || isUserReady}
          onClick={() => onBeReady({})}
          loading={isLoading}
        >
          <Translate
            pt="Entendi tudo e estou pronto para jogar!"
            en="I understood everything and I'm ready to play!"
          />
        </Button>
        <Button
          icon={isUserReady ? <CheckCircleFilled /> : <MehFilled />}
          disabled={isLoading || isUserReady}
          onClick={() => onBeReady({})}
          loading={isLoading}
        >
          <Translate pt="Não entendi nada, mas vamos lá!" en="I don't get it but let's go!" />
        </Button>
        <Button
          type="primary"
          danger
          icon={isUserReady ? <CheckCircleFilled /> : <RobotFilled />}
          disabled={isLoading || isUserReady}
          onClick={() => onBeReadyQue({})}
          loading={isLoading}
        >
          <Translate pt="Quê?" en="What?" />
        </Button>
      </Space>
      <ReadyPlayersBar players={players} />
    </Layout.Content>
  );
}
