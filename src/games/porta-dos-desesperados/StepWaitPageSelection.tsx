import { type ReactNode, useMemo, useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { PanicIcon } from 'icons/PanicIcon';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { WaitingRoom } from 'components/players';
import { Step } from 'components/steps';
// Internal
import { shouldAnnounceTrap } from './utils/helpers';
import { PORTA_DOS_DESESPERADOS_PHASES } from './utils/constants';
import type { TrapEntry } from './utils/types';
import { BookHighlight } from './components/Highlights';
import { TrapPopupRule } from './components/RulesBlobs';

type StepSelectPagesProps = {
  currentCorridor: number;
  trap: string;
  trapEntry: TrapEntry | null;
  players: GamePlayers;
  possessed: GamePlayer;
};

export function StepWaitPageSelection({ possessed, players, trap, trapEntry }: StepSelectPagesProps) {
  const showTrap = useMemo(
    () => shouldAnnounceTrap(trap, PORTA_DOS_DESESPERADOS_PHASES.BOOK_POSSESSION),
    [trap],
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
        icon={<PossessionAnimation />}
        instruction={
          <Translate
            pt={
              <>
                <PlayerAvatarName player={possessed} /> está sendo possuído(a) pelo{' '}
                <BookHighlight>Livro que Tudo Sabe</BookHighlight> e nos mostrará páginas do livro que nos
                ajudem a descobrir em qual porta entrar.
              </>
            }
            en={
              <>
                <PlayerAvatarName player={possessed} /> is being possessed by the{' '}
                <BookHighlight>Book That Knows It All</BookHighlight> and will show us pages of the book that
                could help us find out which door to enter.
              </>
            }
          />
        }
      />

      {showTrap && <TrapPopupRule trapEntry={trapEntry} />}
    </Step>
  );
}

export function PossessionAnimation() {
  const [possessionLevel, setPossessionLevel] = useState(0);

  const animation: StringDictionary = {
    0: getAnimationClass('shakeX', { speed: 'fast', infinite: true }),
    1: 'super-possession',
    2: 'extreme-possession',
    3: getAnimationClass('headShake', { speed: 'slower', infinite: true }),
  };

  const text: Record<string, ReactNode> = {
    0: <Translate pt="Tentar acalmar a possessão" en="Try to calm the possession" />,
    1: <Translate pt="Vixi, piorou!" en="Oh no, it got worse!" />,
    2: <Translate pt="Ave Maria cheia de graça...!" en="Oh please God make it stop!" />,
    3: (
      <Translate
        pt="Melhor assim, talvez mais um clique pare de vez..."
        en="This is nicer, maybe one more click will make it stop"
      />
    ),
  };

  const onPossessionLevelChange = () => {
    setPossessionLevel((level) => (level + 1) % 4);
  };

  return (
    <Space orientation="vertical">
      <PanicIcon style={{ width: '6rem' }} className={animation[possessionLevel]} />
      <Button size="small" onClick={onPossessionLevelChange}>
        {text[possessionLevel]}
      </Button>
    </Space>
  );
}
