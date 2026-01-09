import { useMemo } from 'react';
// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { StepRankingWrapper } from 'components/ranking';
import { RuleInstruction } from 'components/text';
// Internal
import type { GalleryEntry } from './utils/types';
import { ConstructionHighlight } from './components/Highlights';

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  gallery: GalleryEntry[];
  goToPreviousStep: UseStep['goToPreviousStep'];
};

export function StepRanking({ players, ranking, goToPreviousStep, round, gallery }: StepRankingProps) {
  const fullyIncorrectLocations = useMemo(() => {
    return gallery.filter((entry) => entry.correctPlayersIds.length === 0).length;
  }, [gallery]);

  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          key="1"
          pt="Acertou o planejamento do arquiteto"
          en="Match the architect's plan"
        />,
        <Translate
          key="2"
          pt="Pontos do Arquiteto para cada jogador que acertou o planejamento"
          en="Architect points for each player who matched the plan"
        />,
        <Translate
          key="3"
          pt="Pontos por dar match com outros jogadores no cone errado"
          en="Points for matching with other players on the wrong cone"
        />,
      ]}
    >
      <SpaceContainer>
        <Button onClick={goToPreviousStep}>
          <Translate
            pt="Ver resultado novamente"
            en="See results again"
          />
        </Button>
      </SpaceContainer>

      {fullyIncorrectLocations > 0 && (
        <RuleInstruction type="event">
          <Translate
            pt={
              <>
                O prefeito não gosta quando seus funcionários não sabem o que estão fazendo!{' '}
                <ConstructionHighlight>{fullyIncorrectLocations} construções</ConstructionHighlight> não
                tiveram um consenso com o engenheiro-chefe, então o prefeito vai colocá-las em lugares
                aleatórios da cidade para a próxima rodada.
              </>
            }
            en={
              <>
                The mayor doesn't like it when his employees don't know what they're doing!{' '}
                <ConstructionHighlight>{fullyIncorrectLocations} constructions</ConstructionHighlight> had no
                consensus with the lead engineer, so the mayor will place them in random locations in the city
                for the next round.
              </>
            }
          />
        </RuleInstruction>
      )}

      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
