// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { UfoIcon } from '@icons/UfoIcon';
// Components
import { Translate } from '@components/language/Translate';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSelectPlayer } from '@components/steps/StepSelectPlayer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitAlienAPIRequest } from './utils/api-requests';
import { COMUNICACAO_ALIENIGENA_PHASES } from './utils/constants';
import type { PhaseAlienSelectionState } from './utils/types';
import { CurseItemHighlight, HieroglyphHighlight, ItemsHighlight } from './components/Highlights';

export function PhaseAlienSelection({ state, players }: PhaseProps<PhaseAlienSelectionState>) {
  const { step, setStep } = useStep();

  const onSubmitAlien = useOnSubmitAlienAPIRequest(setStep);

  const status = state.status;

  const announcement = (
    <PhaseAnnouncement
      icon={<UfoIcon />}
      title={
        <Translate
          en="Who will be the Alien?"
          pt="Quem quer ser o alienígena?"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    />
  );

  const title = (
    <Translate
      en="Who will be the Alien?"
      pt="Quem quer ser o alienígena?"
    />
  );

  const ruleInstruction = (
    <Translate
      en="An alien has arrived on Earth and does not speak our language. However, we figured out that they want to abduct <neededObjects>objects</neededObjects> but we don't know which ones.
          <br />
          Each round, we will show a few objects to the alien in the intent to figure out one of the 25 alien characters related to those objects. For example, if we should a 'ball' and 'tire' we might figure out what symbol means 'round'.
          <br />
          Then, the alien will request an specific object using their language.
          <br />
          We have {timeLeft} chances to offer all request objects, but among the 25 objects there are {curses} ones that the alien considered cursed. If we offer one of them, we waste one additional chance.
          <br />
          <strong>One player must be the alien, the game master will select it.</strong>"
      pt="Um alienígena chegou à Terra e não fala nossa língua. Porém, descobrimos que ele quer abduzir <neededObjects>objetos</neededObjects>, mas não sabemos quais.
          <br />
          A cada rodada, devemos mostrar alguns objetos ao alienígena com o objetivo de desvendar um dos 25 caracteres alienígenas relacionados àqueles objetos. Por exemplo, mostrar uma 'bola' e um 'pneu' talvez descobriremos o símbolo para 'redondo'.
          <br />
          Então o alienígena vai pedir um objeto específico usando símbolos de sua língua alienígena.
          <br />
          Teremos {timeLeft} chances de entregar todos os objetos ao alienígena, mas dentre os 25 objetos, há {curses} que o alienígena considera amaldiçoado e não quer. Se você oferece um deles, uma chance adicional é usada naquela rodada.
          <br />
          <strong>Um jogador deve ser o alienígena. O VIP selecionará o alienígena.</strong>"
      values={{
        neededObjects: (children) => (
          <ItemsHighlight type="positive">
            {status.needed} {children}
          </ItemsHighlight>
        ),
        hieroglyphs: (children) => <HieroglyphHighlight>{children}</HieroglyphHighlight>,
        timeLeft: <TimeHighlight>{status.timeLeft}</TimeHighlight>,
        curses: <CurseItemHighlight type="negative">{status.totalCurses}</CurseItemHighlight>,
      }}
    />
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={COMUNICACAO_ALIENIGENA_PHASES.ALIEN_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepSelectPlayer
          players={players}
          announcement={announcement}
          titleProps={{
            children: <>{title}</>,
          }}
          ruleInstructionProps={{
            children: <>{ruleInstruction}</>,
            type: 'lore',
          }}
          onSubmitPlayer={(playerId) => onSubmitAlien({ alienId: playerId })}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
