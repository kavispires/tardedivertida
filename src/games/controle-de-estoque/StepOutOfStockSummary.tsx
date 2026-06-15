// Types
import type { GamePlayers } from 'types/game';
// Utils
import { sortPlayers } from 'utils/helpers';
// Components
import { TimedButton } from 'components/buttons/TimedButton';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Step } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { Gallery, Good } from './utils/types';
import { ResultsSummaryTableCard } from './components/ResultsSummaryTableCard';

type StepOutOfStockSummaryProps = {
  players: GamePlayers;
  goodsDict: Dictionary<Good>;
  goToNextStep: () => void;
  gallery: Gallery;
};

export function StepOutOfStockSummary({
  players,
  goodsDict,
  goToNextStep,
  gallery,
}: StepOutOfStockSummaryProps) {
  const sortedPlayer = sortPlayers(players);

  return (
    <Step fullWidth>
      <StepTitle>
        <Translate
          pt="Produtos Marcados como Fora de Estoque"
          en="Out of Stock Products"
        />
      </StepTitle>

      <RuleInstruction type="scoring">
        <Translate
          pt={
            <>
              Você ganha <PointsHighlight type="positive">3 pontos</PointsHighlight> para cada produto que
              realmente não estava disponível no galpão.
              <br />
              Você perde <PointsHighlight type="negative">-1 ponto</PointsHighlight> para cada produto que
              marcou como fora de estoque incorretamente.
            </>
          }
          en={
            <>
              You earn <PointsHighlight type="positive">3 points</PointsHighlight> for each product that was
              actually out of stock.
              <br />
              You lose <PointsHighlight type="negative">-1 point</PointsHighlight> for each product you
              incorrectly marked as out of stock.
            </>
          }
        />
      </RuleInstruction>

      <ResultsSummaryTableCard
        playersList={sortedPlayer}
        correctEntries={gallery.outOfStockOrders}
        wrongEntries={gallery.wrongOutOfStockOrders}
        goodsDict={goodsDict}
        correctPointValue={3}
        wrongPointValue={-1}
      />

      <SpaceContainer>
        <TimedButton
          duration={20}
          onClick={goToNextStep}
          onExpire={goToNextStep}
        >
          <Translate
            pt="Continuar"
            en="Continue"
          />
        </TimedButton>
      </SpaceContainer>
    </Step>
  );
}
