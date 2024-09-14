// Types
import type { GamePlayer } from 'types/player';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
// Internal
import type { CloverObject, Leaves } from './utils/types';
import { useCloverState } from './utils/useCloverState';
import { Clover } from './components/Clover';
import { DetachedLeaves } from './components/DetachedLeaves';

type StepWaitCloverProps = {
  activeCloverPlayer: GamePlayer;
  clover: CloverObject;
  leaves: Leaves;
};

export function StepWaitClover({ activeCloverPlayer, clover, leaves }: StepWaitCloverProps) {
  const { mode, rotation, rotations, onLeafRotate, onRotateClover, usedLeavesIds } = useCloverState(
    'view',
    clover,
    leaves
  );

  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate
          pt={
            <>
              Adivinhação do trevo do(a) <AvatarName player={activeCloverPlayer} />
            </>
          }
          en={
            <>
              Guessing <AvatarName player={activeCloverPlayer} />
              's clover
            </>
          }
        />
      </Title>

      <Instruction contained>
        <Translate
          pt={
            <>
              Aguarde enquanto os outros jogadores tentam adivinhar.
              <br />
              Enquanto isso, veja as cartas que eles tem disponíveis.
            </>
          }
          en={
            <>
              Wait while other players are trying to guess your clover.
              <br /> In the meantime, check it out the cards they have available.
            </>
          }
        />
      </Instruction>

      <Clover mode={mode} clover={clover} leaves={leaves} onRotate={onRotateClover} rotation={rotation} />

      <DetachedLeaves
        leaves={leaves}
        rotations={rotations}
        onLeafRotate={onLeafRotate}
        usedLeavesIds={usedLeavesIds}
      />
    </Step>
  );
}
