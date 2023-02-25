// Hooks
import { useMemo } from 'react';
// Utils
import { PHASES } from 'utils/phases';
import { getAnimationClass } from 'utils/helpers';
import { shouldAnnounceTrap } from './utils/helpers';
// Icons
import { PanicIcon } from 'icons/PanicIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { WaitingRoom } from 'components/players';
import { Step } from 'components/steps';
import { BookHighlight } from './components/Highlights';
import { TrapPopupRule } from './components/RulesBlobs';

type StepSelectPagesProps = {
  currentCorridor: number;
  trap: string;
  players: GamePlayers;
  possessed: GamePlayer;
};

export function StepWaitPageSelection({ possessed, players, trap }: StepSelectPagesProps) {
  const showTrap = useMemo(
    () => shouldAnnounceTrap(trap, PHASES.PORTA_DOS_DESESPERADOS.BOOK_POSSESSION),
    [trap]
  );

  return (
    <Step fullWidth>
      <WaitingRoom
        players={players}
        title={
          <Translate
            pt="Aguarde enquanto a possessão acontece"
            en="Please wait while the possession has finished"
          />
        }
        icon={
          <PanicIcon
            style={{ width: '6rem' }}
            className={getAnimationClass('shakeX', undefined, 'fast', true)}
          />
        }
        instruction={
          <Translate
            pt={
              <>
                <AvatarName player={possessed} /> está sendo possuído(a) pelo{' '}
                <BookHighlight>Livro que Tudo Sabe</BookHighlight> e nos mostrará páginas do livro que nos
                ajudem a descobrir em qual porta entrar.
              </>
            }
            en={
              <>
                <AvatarName player={possessed} /> is being possessed by the{' '}
                <BookHighlight>Book That Knows It All</BookHighlight> and will show us pages of the book that
                could help us find out which door to enter.
              </>
            }
          />
        }
      />

      {showTrap && <TrapPopupRule trap={trap} />}
    </Step>
  );
}
