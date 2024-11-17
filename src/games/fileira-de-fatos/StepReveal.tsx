import { useMemo } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
import type { TextCard } from 'types/tdr';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { AvatarName } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import { getReference } from './utils/helpers';
import { Scenarios } from './components/Scenarios';
import { Results } from './components/Results';
import { RoundTypeExplanation } from './components/RoundTypeExplanation';

type StepRevealProps = {
  activePlayer: GamePlayer;
  players: GamePlayers;
  goToNextStep: UseStep['goToNextStep'];
  scenarios: TextCard[];
  roundType: string;
} & Pick<StepProps, 'announcement'>;

export function StepReveal({
  announcement,
  activePlayer,
  players,
  goToNextStep,
  scenarios,
  roundType,
}: StepRevealProps) {
  const scenarioDictionary = useMemo(
    () =>
      scenarios.reduce(
        (acc, scenario) => {
          acc[scenario.id] = scenario;
          return acc;
        },
        {} as Record<CardId, TextCard>
      ),
    [scenarios]
  );

  const result = (activePlayer.currentOrder ?? []).map((id: CardId) => scenarioDictionary[id]);

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={
            <>
              Resultado para <AvatarName player={activePlayer} />
            </>
          }
          en={
            <>
              Results for <AvatarName player={activePlayer} />
            </>
          }
        />
      </Title>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Essa é a ordem que o(a) juiz(a) {activePlayer.name} escolheu os cenários, do ruim para o pior.
              Abaixo de cada cenário você pode ver a posição que cada jogador escolheu e se eles ganharam
              pontos.
            </>
          }
          en={
            <>
              This is the order that {activePlayer.name} chose the scenarios, from bad to worst. Below each
              scenario you can see the position that each player chose and if they got any points.
            </>
          }
        />
      </RuleInstruction>

      {roundType !== 'NORMAL' && <RoundTypeExplanation roundType={roundType} />}

      <Scenarios scenarios={result} reference={getReference('negative')} player={activePlayer} />

      <Results
        players={players}
        activePlayerId={activePlayer.id}
        correctOrder={activePlayer.currentOrder ?? []}
        scenarioDictionary={scenarioDictionary}
        roundType={roundType}
      />

      <Space className="space-container" align="center">
        <TimedButton duration={40} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>
    </Step>
  );
}
