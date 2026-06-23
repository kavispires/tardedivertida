// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useSortedPlayers } from '@hooks/useSortedPlayers';
// Components
import { TimedButton } from '@components/buttons/TimedButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { Step } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { Gallery, Good } from './utils/types';
import { ResultsSummaryTableCard } from './components/ResultsSummaryTableCard';

type StepFulfillmentSummaryProps = {
  players: GamePlayers;
  goodsDict: Dictionary<Good>;
  goToNextStep: () => void;
  gallery: Gallery;
};

export function StepFulfillmentSummary({
  players,
  goodsDict,
  goToNextStep,
  gallery,
}: StepFulfillmentSummaryProps) {
  const sortedPlayers = useSortedPlayers(players);

  return (
    <Step fullWidth>
      <StepTitle>
        <Translate
          pt="Vendas Efetivadas"
          en="Fulfilled Sales"
        />
      </StepTitle>

      <RuleInstruction type="scoring">
        <Translate
          pt={
            <>
              Você ganha <PointsHighlight type="positive">3 pontos</PointsHighlight> para cada produto que
              colocou no local correto.
              <br />
              Você perde <PointsHighlight type="negative">-1 ponto</PointsHighlight> para cada produto
              colocado no local errado.
            </>
          }
          en={
            <>
              You earn <PointsHighlight type="positive">3 points</PointsHighlight> for each product you placed
              in the correct location.
              <br />
              You lose <PointsHighlight type="negative">-1 point</PointsHighlight> for each product placed in
              the wrong location.
            </>
          }
        />
      </RuleInstruction>

      <ResultsSummaryTableCard
        playersList={sortedPlayers}
        correctEntries={gallery.fulfilledOrders}
        wrongEntries={gallery.wrongFulfillments}
        goodsDict={goodsDict}
        correctPointValue={3}
        wrongPointValue={-1}
      />

      <SpaceContainer>
        <TimedButton
          duration={30}
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
