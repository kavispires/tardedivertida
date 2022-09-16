// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useMock } from 'hooks/useMock';
// Utils
import { LETTERS } from 'utils/constants';
import { mockSelectChallenge } from './utils/mock';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { ContendersHand } from './components/ContendersHand';

type StepSelectChallengeProps = {
  onSubmitChallenge: GenericFunction;
  challenges: DefaultTextCard[];
  userContenders: WContender[];
  round: GameRound;
};

export function StepSelectChallenge({
  onSubmitChallenge,
  challenges,
  userContenders,
  round,
}: StepSelectChallengeProps) {
  useMock(() => {
    onSubmitChallenge({ challengeId: mockSelectChallenge(challenges) });
  });

  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate pt="Selecione o desafio da rodada" en="Select the theme for the round" />
      </Title>

      <Instruction contained>
        <Translate
          pt={
            <>
              Cada rodada é feita ao redor de um desafio. Você tem competidores em mãos (na barra abaixo) e um
              deles irá participar desta rodada.
            </>
          }
          en={
            <>
              Each round has a challenge for the contenders to battle on! You have a hand of contenders and
              one of them will participate in this round.
            </>
          }
        />
        {round.current < 5 ? (
          <Translate
            pt={
              <>
                <br />
                Selecione o desafio que você acha que um dos seus competidores tem mais change de vencer.
                <br />
                Você ganha 2 pontos se ele(a) vencer.
              </>
            }
            en={
              <>
                <br />
                Select a challenge you think one of your contenders have the best chance of winning.
                <br />
                You get 2 points if they win.
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                <br />
                Este é uma rodada de semifinalistas, então somente competidores que chegaram na semi-final
                participam.
                <br />
                Você não selecionará um competidor dessa vez.
              </>
            }
            en={
              <>
                <br />
                This is a semifinalist round, so only contenders that got to the semifinals will participate.
                <br />
                You won't select a contender this time.
              </>
            }
          />
        )}
      </Instruction>

      <Space className="space-container" align="center">
        {challenges.map((challenge, index) => {
          return (
            <TransparentButton
              key={challenge.id}
              onClick={() => onSubmitChallenge({ challengeId: challenge.id })}
            >
              <Card header={LETTERS[index]} randomColor>
                {challenge.text}
              </Card>
            </TransparentButton>
          );
        })}
      </Space>

      {round.current < 5 && <ContendersHand contenders={userContenders} />}
    </Step>
  );
}
