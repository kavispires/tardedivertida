// Ant Design Resources
import { Button } from 'antd';
// Components
import {
  AdminNextRoundButton,
  ButtonContainer,
  Instruction,
  RankingBoard,
  Step,
  Title,
  Translate,
} from 'components';

type StepRankingProps = {
  ranking: GameRanking;
  players: GamePlayers;
  goToPreviousStep: GenericFunction;
  round: GameRound;
  lastRound?: boolean;
};

export function StepRanking({ ranking, players, goToPreviousStep, round, lastRound }: StepRankingProps) {
  const roundPoints = round.total - round.current + 1;

  return (
    <Step fullWidth>
      <Title>Ranking</Title>
      <Instruction contained>
        <Translate
          pt={<>Pares corretos ganham {roundPoints} pontos nessa rodada. 1 ponto a menos na próxima.</>}
          en={<>Correct pairs get {roundPoints} points this round. 1 point less next round.</>}
        />
      </Instruction>

      <RankingBoard ranking={ranking} players={players} />

      <ButtonContainer>
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </ButtonContainer>
      <AdminNextRoundButton round={round} lastRound={lastRound} />
    </Step>
  );
}
