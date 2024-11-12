// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCache, useCacheAlternative } from 'hooks/useCache';
import { useStep } from 'hooks/useStep';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { UfoIcon } from 'icons/UfoIcon';
// Components
import { Translate } from 'components/language';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { StepSelectPlayer } from 'components/steps/StepSelectPlayer';
// Internal
import { useOnSubmitAlienAPIRequest } from './utils/api-requests';
import { CurseItemHighlight, HieroglyphHighlight, ItemsHighlight } from './components/Highlights';

export function PhaseAlienSelection({ players, state }: PhaseProps) {
  const { step, setStep } = useStep();

  // Clear cache from previous games
  useCache({ clearCache: true });
  useCacheAlternative({ clearCache: true });

  const onSubmitAlien = useOnSubmitAlienAPIRequest(setStep);

  const status = state.status;

  const announcement = (
    <PhaseAnnouncement
      icon={<UfoIcon />}
      title={<Translate pt="Quem quer ser o alienígena?" en="Who will be the Alien?" />}
      currentRound={state?.round?.current}
      type="overlay"
    />
  );

  const title = <Translate pt="Quem quer ser o alienígena?" en="Who will be the Alien?" />;

  const ruleInstruction = (
    <Translate
      pt={
        <>
          Um alienígena chegou à Terra e não fala nossa língua. Porém, descobrimos que ele quer abduzir{' '}
          <ItemsHighlight type="positive">{status.needed} objetos</ItemsHighlight>, mas não sabemos quais.
          <br />A cada rodada, devemos mostrar alguns objetos ao alienígena com o objetivo de desvendar um dos
          <HieroglyphHighlight>25 caracteres alienígenas</HieroglyphHighlight> relacionados àqueles objetos.
          Por exemplo, mostrar uma "bola" e um "pneu" talvez descobriremos o símbolo para "redondo".
          <br />
          Então o alienígena vai pedir um objeto específico usando símbolos de sua língua alienígena.
          <br />
          Teremos <TimeHighlight>{status.timeLeft}</TimeHighlight> chances de entregar todos os objetos ao
          alienígena, mas dentre os 25 objetos, há{' '}
          <CurseItemHighlight type="negative">{status.totalCurses}</CurseItemHighlight> que o alienígena
          considera amaldiçoado e não quer. Se você oferece um deles, uma chance adicional é usada naquela
          rodada.
          <br />
          <strong>Um jogador deve ser o alienígena. O VIP selecionará o alienígena.</strong>
        </>
      }
      en={
        <>
          An alien has arrived on Earth and does not speak our language. However, we figured out that they
          want to abduct
          <ItemsHighlight>{status.needed}</ItemsHighlight> objects but we don't know which ones.
          <br />
          Each round, we will show a few objects to the alien in the intent to figure out one of the 25 alien
          characters related to those objects. For example, if we should a "ball" and "tire" we might figure
          out what symbol means "round".
          <br />
          Then, the alien will request an specific object using their language.
          <br />
          We have <TimeHighlight>{status.timeLeft}</TimeHighlight> chances to offer all request objects, but
          among the 25 objects there are{' '}
          <CurseItemHighlight type="negative">{status.totalCurses}</CurseItemHighlight> ones that the alien
          considered cursed. If we offer one of them, we waste one additional chance.
          <br />
          <strong>One player must be the alien, the game master will select it.</strong>
        </>
      }
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.ALIEN_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepSelectPlayer
          players={players}
          announcement={announcement}
          titleProps={{
            children: <>{title}</>,
            white: true,
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
