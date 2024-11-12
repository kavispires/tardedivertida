// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GameRound, GameRanking } from 'types/game';
import type { GamePlayers } from 'types/player';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { RuleInstruction } from 'components/text';

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  onGoBack: () => void;
};

export function StepRanking({ players, ranking, onGoBack, round }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate pt="Rotas corretos" en="Correct paths" />,
        <Translate pt="Pontos por sua rota" en="Points for your route" />,
      ]}
    >
      <RuleInstruction type="event">
        <Translate
          pt="Não se preocupe se você ficou pra trás! o jogador mais a frente de cada rota, te gritou e você conseguiu encontrá-lo."
          en="Don't worry if you were left behind! The player furthest ahead on that route, call you and you caught up"
        />
      </RuleInstruction>

      <Space className="space-container" align="center">
        <Button onClick={onGoBack}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
