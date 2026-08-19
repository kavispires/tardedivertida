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
  const sortedPlayers = useSortedPlayers(players);

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
          pt="Você ganha {correctPoints} para cada produto que realmente não estava disponível no galpão.<br/>Você perde {penalty} para cada produto que marcou como fora de estoque incorretamente."
          en="You earn {correctPoints} for each product that was actually out of stock.<br/>You lose {penalty} for each product you incorrectly marked as out of stock."
          values={{
            correctPoints: (
              <PointsHighlight
                type="positive"
                value={3}
              />
            ),
            penalty: (
              <PointsHighlight
                type="negative"
                value={-1}
              />
            ),
          }}
        />
      </RuleInstruction>

      <ResultsSummaryTableCard
        playersList={sortedPlayers}
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
