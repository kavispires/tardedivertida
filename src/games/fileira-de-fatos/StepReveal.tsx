import { useMemo } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Utils
import { getReference } from './utils/helpers';
// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Scenarios } from './components/Scenarios';
import { AvatarName } from 'components/avatars';
import { Results } from './components/Results';
import { RoundTypeExplanation } from './components/RoundTypeExplanation';

type StepRevealProps = {
  activePlayer: GamePlayer;
  players: GamePlayers;
  goToNextStep: GenericFunction;
  scenarios: TextCard[];
  roundType: string;
} & AnnouncementProps;

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

      {roundType !== 'NORMAL' && (
        <Instruction contained>
          <RoundTypeExplanation roundType={roundType} />
        </Instruction>
      )}

      <Scenarios scenarios={result} reference={getReference('negative')} />

      <Results
        players={players}
        activePlayerId={activePlayer.id}
        correctOrder={activePlayer.currentOrder ?? []}
        scenarioDictionary={scenarioDictionary}
        roundType={roundType}
      />

      <Space className="space-container" align="center">
        <TimedButton duration={30} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>
    </Step>
  );
}
