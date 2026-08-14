import { useState } from 'react';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { DevButton } from '@components/debug/DevButton';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { ItemData, SubmitPairsPayload } from './utils/types';
import { mockPairs } from './utils/mock';
import { MatchingPlayArea } from './components/MatchingPlayArea';

type StepTemplateProps = {
  user: GamePlayer;
  pool: ItemData[];
  onSubmitPairs: (payload: SubmitPairsPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepMakePairs({ user, announcement, pool, onSubmitPairs }: StepTemplateProps) {
  const { isLoading } = useLoading();
  const [pairs, setPairs] = useState<(string | null)[]>([]);
  const pairsCount = Math.floor(pool.length / 2);

  const isComplete = pairs.length === pairsCount * 2 && pairs.every(Boolean);

  useMock(() => {
    onSubmitPairs({ pairs: mockPairs(pool) });
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={`Agrupe os itens em ${pairsCount} pares`}
          en={`Group the items into ${pairsCount} pairs`}
        />
      </StepTitle>

      {isLoading}
      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Você ganha <PointsHighlight value="pontos" /> por cada jogador que fez o mesmo par que você!
              <br />
              <strong>Arraste e solte</strong> os itens nos slots para criar pares.
              <br />
              Para remover, basta clicar no item novamente.
            </>
          }
          en={
            <>
              You get <PointsHighlight value="points" /> for each player who did the same pair than you!
              <br />
              <strong>Drag and drop</strong> items to slots to create pairs.
              <br />
              To remove, just click on the item again.
            </>
          }
        />
      </RuleInstruction>

      {pool.length % 2 === 1 && (
        <RuleInstruction type="event">
          <Translate
            pt={
              <>
                Um item ficará sobrando, você também ganha pontos por cada jogador que também deixou esse item
                sobrando!
              </>
            }
            en="One item will be left out, you also get points for each player who also left this item out!"
          />
        </RuleInstruction>
      )}

      <MatchingPlayArea
        pool={pool}
        pairs={pairs}
        setPairs={setPairs}
        pairsCount={pairsCount}
        disabled={isLoading || user.ready}
      />

      <SpaceFloat enabled={isComplete}>
        <DevButton onClick={() => setPairs(mockPairs(pool))}>Mock Pairs</DevButton>
        <SendButton
          size="large"
          disabled={user.ready || !isComplete}
          onClick={() => onSubmitPairs({ pairs: pairs.map((v) => String(v)) })}
        >
          <Translate
            pt="Enviar Pares"
            en="Submit Pairs"
          />
        </SendButton>
      </SpaceFloat>
    </Step>
  );
}
