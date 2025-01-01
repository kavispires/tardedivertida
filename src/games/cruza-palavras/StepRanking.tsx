// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRanking, GameRound } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { StepRankingWrapper } from 'components/ranking';
import { PopoverRule } from 'components/rules';
// Internal
import { ScoringRule } from './components/RulesBlobs';

type StepRankingProps = {
  players: GamePlayers;
  playerCount: number;
  round: GameRound;
  ranking: GameRanking;
  goToPreviousStep: UseStep['goToPreviousStep'];
};

export function StepRanking({ players, playerCount, ranking, goToPreviousStep, round }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate key="1" pt="Palpites corretos" en="Correct guesses" />,
        <Translate
          key="2"
          pt="Palpites que acertaram a célula de outra dica"
          en="Guesses that were placed in a cell for a different clue"
        />,
        <Translate key="3" pt="Palpites recebidos corretamente" en="Received correct guesses" />,
        <Translate
          key="4"
          pt="Penalidade se ninguém acertou a sua dica"
          en="Penalty for nobody getting your clue correctly"
        />,
      ]}
    >
      <PopoverRule content={<ScoringRule playerCount={playerCount} />} />

      <SpaceContainer align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </SpaceContainer>
      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
