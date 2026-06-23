import { useState } from 'react';
// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useCountdown } from '@hooks/useCountdown';
// Components
import { TimedButton } from '@components/buttons/TimedButton';
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { GalleryEntry } from './utils/types';
import { MetricsBoard } from './components/MetricsBoard';
import { ResultBrackets } from './components/ResultBrackets';

type StepResultsProps = {
  players: GamePlayers;
  presenter: GamePlayer;
  result: GalleryEntry;
  goToNextStep: () => void;
} & Pick<StepProps, 'announcement'>;

export function StepResults({ players, presenter, result, goToNextStep, announcement }: StepResultsProps) {
  const [visible, setVisible] = useState(false);
  useCountdown({
    duration: 4,
    onExpire: () => setVisible(true),
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle size="small">
        <Translate
          pt={
            <>
              Resultados para apresentador(a) <PlayerAvatarName player={presenter} />
            </>
          }
          en={
            <>
              Results for presenter <PlayerAvatarName player={presenter} />
            </>
          }
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          en={
            <>
              The guessers get <PointsHighlight>points</PointsHighlight> based on the bracket their last guess
              falls into, if correct.
              <br />
              They also lose <PointsHighlight type="negative">1 point</PointsHighlight> if they made more than
              one guess.
              <br />
              The presenter gets <PointsHighlight type="positive">2 points</PointsHighlight> for each who
              guessed correctly.
            </>
          }
          pt={
            <>
              Os adivinhadores ganham <PointsHighlight>pontos</PointsHighlight> baseados no quadrado em que a
              última adivinhação está, se o palpite estiver correto.
              <br />
              Mas eles também perdem <PointsHighlight type="negative">1 ponto</PointsHighlight> se fizeram
              mais de um palpite.
              <br />O apresentador ganha <PointsHighlight type="positive">2 pontos</PointsHighlight> por cada
              adivinhador que acertou.
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer>
        <TextCard size="large">{result.cards[result.secretWordId].text}</TextCard>
      </SpaceContainer>

      <div className="m-guessing-board">
        <MetricsBoard
          metricsDescriptors={result.metricsDescriptors}
          evaluations={result.metrics}
          level={visible ? 5 : 0}
        />
        <ResultBrackets
          brackets={result.brackets}
          players={players}
          cards={result.cards}
        />
      </div>

      <SpaceContainer className="mt-8">
        <TimedButton
          duration={45}
          onExpire={goToNextStep}
          onClick={goToNextStep}
          icon={<TrophyOutlined />}
        >
          <Translate
            pt="Ver Ranking"
            en="See Ranking"
          />
        </TimedButton>
      </SpaceContainer>
    </Step>
  );
}
