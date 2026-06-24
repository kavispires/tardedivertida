// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking, GamePlayers } from 'types/game';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepRankingWrapper } from '@components/wrappers/StepRankingWrapper';

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
        <Translate
          key="1"
          pt="Rotas corretos"
          en="Correct paths"
        />,
        <Translate
          key="2"
          pt="Pontos por sua rota"
          en="Points for your route"
        />,
      ]}
    >
      <RuleInstruction type="event">
        <Translate
          pt="Não se preocupe se você ficou pra trás! O jogador mais a frente de cada rota, te gritou e você conseguiu encontrá-lo."
          en="Don't worry if you were left behind! The player furthest ahead on that route, call you and you caught up"
        />
      </RuleInstruction>

      <SpaceContainer>
        <Button onClick={onGoBack}>
          <Translate
            pt="Ver resultado novamente"
            en="See results again"
          />
        </Button>
      </SpaceContainer>
      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
