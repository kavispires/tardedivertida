// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import { GamePlayers } from 'types/player';
import { GameRanking, GameRound } from 'types/game';
import type { UseStep } from 'hooks/useStep';
// Components
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { ScoringRule } from './components/RulesBlobs';
import { StepRankingWrapper } from 'components/ranking';
import { HostNextPhaseButton } from 'components/host';

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
        <Translate pt="Palpites corretos" en="Correct guesses" />,
        <Translate
          pt="Palpites que acertaram a célula de outra dica"
          en="Guesses that were placed in a cell for a different clue"
        />,
        <Translate pt="Palpites recebidos corretamente" en="Received correct guesses" />,
        <Translate
          pt="Penalidade se ninguém acertou a sua dica"
          en="Penalty for nobody getting your clue correctly"
        />,
      ]}
    >
      <PopoverRule content={<ScoringRule playerCount={playerCount} />} />

      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
