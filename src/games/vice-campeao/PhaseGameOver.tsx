// Ant Design Resources
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Flex, Progress, Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { Container } from 'components/layout/Container';
// Internal
import type { PhaseGameOverState } from './utils/types';
import achievementsReference from './utils/achievements';
import { RaceTrack } from './components/RaceTrack';
import { CardPlay } from './components/CardPlay';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const runActivity = state.replay[step];
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
      <Container title={<Translate pt="Corrida Completa" en="Full Race" />} className="mt-4">
        <Flex justify="space-between" align="center" vertical gap={8}>
          <Progress
            steps={state.replay.length}
            showInfo={false}
            percent={(100 * (step + 1)) / state.replay.length}
          />
          <Flex gap={8} align="center">
            <Space.Compact size="small">
              <Button icon={<ArrowLeftOutlined />} onClick={goToPreviousStep}>
                <Translate pt="Carta Anterior" en="Previous Card" />
              </Button>
              <Button icon={<ArrowRightOutlined />} onClick={goToNextStep} iconPosition="end">
                <Translate pt="Próxima Carta" en="Next Card" />
              </Button>
            </Space.Compact>
          </Flex>

          <RaceTrack runActivity={state.replay[step]} players={players} />
          {state.cardsDict[runActivity?.cardId] && (
            <CardPlay runActivity={runActivity} players={players} cardsDict={state.cardsDict} />
          )}
        </Flex>
      </Container>
    </GameOverWrapper>
  );
}
