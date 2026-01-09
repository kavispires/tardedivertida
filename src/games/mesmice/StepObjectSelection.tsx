// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useMock } from 'hooks/useMock';
// Components
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { ObjectCardObj } from './utils/types';
import { mockObjectIdSelection } from './utils/mock';
import { ObjectCard } from './components/ObjectCard';

type StepSelectObjectProps = {
  user: GamePlayer;
  onSelectObject: (id: string) => void;
} & Pick<StepProps, 'announcement'>;

export function StepSelectObject({ user, announcement, onSelectObject }: StepSelectObjectProps) {
  const items: ObjectCardObj[] = user?.items ?? [];

  // Dev only
  useMock(() => onSelectObject(mockObjectIdSelection(items)));

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>Escolha um objeto</>}
          en={<>Select an object</>}
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Neste jogo, você escreverá uma dica que melhor conecta seu objeto com a característica sorteada.
              <br />
              Primeiro, <strong>selecione</strong> um dos objetos abaixo que você tem mais familiaridade.
              <br />
              Certifique-se que é um <strong>objeto</strong> tangível sólido (ou semi-sólido) e inanimado.
              (Por exemplo, se você sair com a gota da água, não selecione ela.)
            </>
          }
          en={
            <>
              In this game, you will write a clue that best connects your object with the assigned
              characteristic.
              <br />
              First, <strong>select</strong> one of the objects below that you are most familiar with.
              <br />
              Make sure it is a tangible solid (or semi-solid) inanimate <strong>object</strong>. (For
              example, if you got the water card or a person, avoid selecting it.)
            </>
          }
        />
      </RuleInstruction>

      <div className="object-selection-container">
        {items.map((item) => (
          <TransparentButton
            key={item.id}
            onClick={() => onSelectObject(item.id)}
          >
            <ObjectCard item={item} />
          </TransparentButton>
        ))}
      </div>
    </Step>
  );
}
