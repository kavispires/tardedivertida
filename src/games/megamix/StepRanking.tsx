// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GameRound, GameRanking } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Icons
import { BouncerIcon } from 'icons/BouncerIcon';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { Step } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
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
      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <HostNextPhaseButton round={round} />
    </>
  );

  if (ranking.length === 0) {
    return (
      <Step>
        <StepTitle size="small">
          <Translate pt="Ranking" en="Ranking" />?
        </StepTitle>

        <Space className="space-container">
          <BouncerIcon width="120" />
        </Space>
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
          pt={<>Pontos por já estar no Time Vencedor.</>}
          en={<>Points for already being on the Winning Team.</>}
        />,
        <Translate
          key="2"
          pt={<>Pontos por entrar no Time Vencedor.</>}
          en={<>Points for joining the Winning Team.</>}
        />,
      ]}
      title={<Translate pt={<>Ranking da Área VIP</>} en={<>VIP Ranking</>} />}
      // TODO: white
      subtitle={innerContent}
    >
      {actions}
    </StepRankingWrapper>
  );
}
