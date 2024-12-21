// Ant Design Resources
import { PictureOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking } from 'types/game';
import type { GamePlayers } from 'types/player';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { PopoverRule } from 'components/rules';
import { RoundsLeftInstruction } from 'components/text';
// Internal
import { ScoringRules } from './components/RulesBlobs';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  round: GameRound;
  onGoBack: () => void;
};

export function StepRanking({ players, ranking, round, onGoBack }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate key="1" pt="Votos corretos" en="Correct guesses" />,
        <Translate
          key="2"
          pt="Votos corretos em seu personagem por outros jogadores"
          en="Correct guesses on your character by other players"
        />,
      ]}
    >
      <PopoverRule content={<ScoringRules currentRound={round.current} />} />

      <RoundsLeftInstruction round={round} />

      <Button size="large" onClick={onGoBack} icon={<PictureOutlined />}>
        <Translate pt="Ver Galeria Novamente" en="See Gallery Again" />
      </Button>

      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
