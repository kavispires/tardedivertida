// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking, GamePlayer, GamePlayers } from 'types/game';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Icons
import { BouncerIcon } from 'icons/BouncerIcon';
// Components
import { HostNextPhaseButton } from 'components/host/HostNextPhaseButton';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { StepRankingWrapper } from 'components/ranking/StepRankingWrapper';
import { Step } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import { useColorizeBackground } from './utils/useColorizeBackground';

type StepRankingProps = {
  user: GamePlayer;
  players: GamePlayers;
  ranking: GameRanking;
  goToPreviousStep: UseStep['goToPreviousStep'];
  round: GameRound;
};

export function StepRanking({ ranking, players, goToPreviousStep, round, user }: StepRankingProps) {
  // Dynamic background
  useColorizeBackground(user, round.current + 1);

  const innerContent = (
    <>
      <RuleInstruction type="alert">
        <Translate
          pt="Somente jogadores na área VIP são ranqueados, porque você não pode ganhar se não estiver lá!"
          en="Only players in the VIP area can be ranked since you can't win if you're not there. We are elitist!"
        />
      </RuleInstruction>
    </>
  );

  const actions = (
    <>
      <SpaceContainer>
        <Button onClick={goToPreviousStep}>
          <Translate
            pt="Ver resultado novamente"
            en="See results again"
          />
        </Button>
      </SpaceContainer>
      <HostNextPhaseButton round={round} />
    </>
  );

  if (ranking.length === 0) {
    return (
      <Step>
        <StepTitle size="small">
          <Translate
            pt="Ranking"
            en="Ranking"
          />
          ?
        </StepTitle>

        <SpaceContainer>
          <BouncerIcon width="120" />
        </SpaceContainer>
        {innerContent}
        {actions}
      </Step>
    );
  }

  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          key="1"
          pt={<>Pontos por já estar na Área VIP.</>}
          en={<>Points for already being in the VIP Area.</>}
        />,
        <Translate
          key="2"
          pt={<>Pontos por entrar a Área VIP.</>}
          en={<>Points for joining the VIP Area.</>}
        />,
      ]}
      title={
        <Translate
          pt={<>Ranking da Área VIP</>}
          en={<>VIP Ranking</>}
        />
      }
      // TODO: white
      subtitle={innerContent}
    >
      {actions}
    </StepRankingWrapper>
  );
}
