import clsx from 'clsx';
// Ant Design Resources
import { Badge } from 'antd';
// Types
import type { TextCard } from 'types/tdr';
// Hooks
import { useBooleanDictionary } from '@hooks/useBooleanDictionary';
import { useCardWidth } from '@hooks/useCardWidth';
import { useMock } from '@hooks/useMock';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { CharacterCard } from '@components/cards/CharacterCard';
import { ImageCardButton } from '@components/image-cards/ImageCardButton';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { CardHighlight } from '@components/metrics/CardHighlight';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { FightingContender, SubmitContendersPayload } from './utils/type';
import { mockSelectContenders } from './utils/mock';
import { contenderWidthOptions } from './utils/helpers';
import { Challenge } from './components/Challenge';

type StepSelectContendersProps = {
  onSubmitContender: (payload: SubmitContendersPayload) => void;
  challenge: TextCard;
  userContenders: FightingContender[];
  contendersPerPlayerNeeded: number;
} & Pick<StepProps, 'announcement'>;

export function StepSelectContenders({
  onSubmitContender,
  challenge,
  userContenders,
  announcement,
  contendersPerPlayerNeeded,
}: StepSelectContendersProps) {
  const cardWidth = useCardWidth(Math.max(userContenders.length ?? 8, 5), contenderWidthOptions);

  const { updateDict, length, keys, dict } = useBooleanDictionary({});

  useMock(() => {
    onSubmitContender({
      contendersIds: mockSelectContenders(userContenders, contendersPerPlayerNeeded),
    });
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Quem pode ganhar esse desafio?"
          en="Who can win this challenge?"
        />
      </StepTitle>

      <Challenge challenge={challenge} />

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Selecione <CardHighlight>{contendersPerPlayerNeeded}</CardHighlight> dos seus competidores para
              entrar no campeonato
            </>
          }
          en={
            <>
              Select <CardHighlight>{contendersPerPlayerNeeded}</CardHighlight> of your contenders to join the
              championship
            </>
          }
        />
      </RuleInstruction>

      <ul className="w-contenders-hand">
        {userContenders.map((contender) => (
          <li
            key={contender.id}
            className="w-contenders-hand__entry"
          >
            <ImageCardButton
              cardId={contender.id}
              onClick={() => updateDict(contender.id)}
              buttonText={
                dict[contender.id] ? (
                  <Translate
                    pt="Desmarcar"
                    en="Deselect"
                  />
                ) : undefined
              }
              buttonProps={{
                className: clsx('w-contenders-hand__button', {
                  'w-contenders-hand__button--selected': dict[contender.id],
                }),
              }}
            >
              <CharacterCard
                character={contender}
                overlayColor="gray"
                size={cardWidth}
                className={clsx('w-contenders-hand__card', {
                  'w-contenders-hand__card--selected': dict[contender.id],
                })}
              />
            </ImageCardButton>
          </li>
        ))}
      </ul>

      <SpaceFloat>
        <Badge count={length}>
          <SendButton
            onClick={() => onSubmitContender({ contendersIds: keys })}
            size="large"
            disabled={length !== contendersPerPlayerNeeded}
          >
            <Translate
              pt="Selecionar"
              en="Select"
            />
          </SendButton>
        </Badge>
      </SpaceFloat>
    </Step>
  );
}
