// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { MysteryBoxIcon } from 'icons/collection';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseCardPlayState } from './utils/types';
import { QUAL_QUESITO_PHASES } from './utils/constants';
import { useOnSubmitCardsAPIRequest } from './utils/api-requests';
import { ItemsHand } from './components/ItemsHand';
import { StepSelectThings } from './StepSelectThings';

export function PhaseCardPlay({ players, state, user }: PhaseProps<PhaseCardPlayState>) {
  const { step, setStep } = useStep();
  const [creator, isTheCreator] = useWhichPlayerIsThe('creatorId', state, players);

  const onSubmitCards = useOnSubmitCardsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<MysteryBoxIcon />}
      title={
        <Translate
          pt="Adicione coisas!"
          en="Add things!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        {isTheCreator ? (
          <Translate
            pt="Adicione pelo menos duas coisas a sua categoria!"
            en="Add at least two things to your category!"
          />
        ) : (
          <Translate
            pt="Examine a categoria e veja se você consegue adicionar coisas a ela!"
            en="Examine the category and see if you can add things to it!"
          />
        )}
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={QUAL_QUESITO_PHASES.CARD_PLAY}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content:
            user?.playedCardsIds?.length > 0 ? (
              <ItemsHand
                hand={user?.playedCardsIds}
                cardsDict={state.cardsDict}
                hideCount
              />
            ) : (
              <Instruction contained>
                <Translate
                  pt="Você não adicionou nada à essa categoria."
                  en="You didn't add anything to this category."
                />
              </Instruction>
            ),
        }}
      >
        {/* Step 0 */}
        <StepSelectThings
          players={players}
          user={user}
          cardsDict={state.cardsDict}
          category={state.category}
          onSubmitCards={onSubmitCards}
          isTheCreator={isTheCreator}
          creator={creator}
          announcement={announcement}
          turnOrder={state.turnOrder}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
