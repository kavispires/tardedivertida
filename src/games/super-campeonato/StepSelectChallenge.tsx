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
import { ReadyPlayersBar } from 'components/players';

type StepSelectChallengeProps = {
  onSubmitChallenge: GenericFunction;
  challenges: DefaultTextCard[];
  userContenders: WContender[];
  players: GamePlayers;
};

export function StepSelectChallenge({
  onSubmitChallenge,
  challenges,
  userContenders,
  players,
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
              Selecione o desafio que você acha que um dos seus competidores tem mais change de vencer.
              <br />
              Você ganha 2 pontos se ele vencer.
            </>
          }
          en={
            <>
              Select a challenge you think one of your contenders have the best chance of winning.
              <br />
              You get 2 points if they win.
            </>
          }
        />
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

      <ReadyPlayersBar players={players} />

      <ContendersHand contenders={userContenders} />
    </Step>
  );
}
