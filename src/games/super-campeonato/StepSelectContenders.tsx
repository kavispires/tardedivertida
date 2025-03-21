// Types
import type { TextCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons';
import { CharacterCard } from 'components/cards/CharacterCard';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { FightingContender, SubmitContendersPayload } from './utils/type';
import { mockSelectContender } from './utils/mock';
import { Challenge } from './components/Challenge';

type StepSelectContendersProps = {
  onSubmitContender: (payload: SubmitContendersPayload) => void;
  challenge: TextCard;
  userContenders: FightingContender[];
} & Pick<StepProps, 'announcement'>;

export function StepSelectContenders({
  onSubmitContender,
  challenge,
  userContenders,
  announcement,
}: StepSelectContendersProps) {
  const cardWidth = useCardWidth(Math.max(userContenders.length ?? 8, 5), { minWidth: 100 });

  useMock(() => {
    onSubmitContender({ contendersId: mockSelectContender(userContenders) });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Quem pode ganhar esse desafio?" en="Who can win this challenge?" />
      </StepTitle>

      <Challenge challenge={challenge} />

      <RuleInstruction type="action">
        <Translate
          pt="Selecione um de seus competidores para entrar no campeonato"
          en="Select one of your contenders to join the championship"
        />
      </RuleInstruction>

      <ul className="w-contenders-hand">
        {userContenders.map((contender) => (
          <li key={contender.id} className="w-contenders-hand__entry">
            <SendButton
              onClick={() => onSubmitContender({ contendersId: contender.id })}
              shape="round"
              type="default"
              ghost
              className="w-contenders-hand__button"
            >
              <Translate pt="Selecionar" en="Select" />
            </SendButton>

            <CharacterCard character={contender} overlayColor="gray" size={cardWidth} />
          </li>
        ))}
      </ul>
    </Step>
  );
}
