// Ant Design Resources
// Hooks
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelectContender } from './utils/mock';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { ContendersHand } from './components/ContendersHand';
import { Challenge } from './components/Challenge';

type StepSelectContendersProps = {
  onSubmitContender: GenericFunction;
  challenge: TextCard;
  userContenders: WContender[];
  players: GamePlayers;
};

export function StepSelectContenders({
  onSubmitContender,
  challenge,
  userContenders,
  players,
}: StepSelectContendersProps) {
  useMock(() => {
    onSubmitContender({ contendersId: mockSelectContender(userContenders) });
  });

  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate pt="Quem pode ganhar esse desafio?" en="Who can win this challenge?" />
      </Title>

      <Challenge challenge={challenge} />

      <Instruction contained>
        <Translate
          pt="Selecione um de seus competidores para entrar no campeonato"
          en="Select one of your contenders to join the championship"
        />
      </Instruction>

      <ContendersHand
        contenders={userContenders}
        onSelect={(id) => onSubmitContender({ contendersId: id })}
      />
    </Step>
  );
}
