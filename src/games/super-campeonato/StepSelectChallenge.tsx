// Types
import type { GameRound } from 'types/game';
import type { TextCard } from 'types/tdr';
// Hooks
import { useMock } from 'hooks/useMock';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { FightingContender } from './utils/type';
import { mockSelectChallenge } from './utils/mock';
import { ContendersHand } from './components/ContendersHand';

type StepSelectChallengeProps = {
  onSubmitChallenge: GenericFunction;
  challenges: TextCard[];
  userContenders: FightingContender[];
  round: GameRound;
} & Pick<StepProps, 'announcement'>;

export function StepSelectChallenge({
  onSubmitChallenge,
  challenges,
  userContenders,
  round,
  announcement,
}: StepSelectChallengeProps) {
  useMock(() => {
    onSubmitChallenge({ challengeId: mockSelectChallenge(challenges) });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Selecione o desafio da rodada" en="Select the theme for the round" />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt={<>Cada rodada é feita ao redor de um desafio.</>}
          en={<>Each round has a challenge for the contenders to battle on!</>}
        />
        {userContenders.length > 1 && (
          <Translate
            pt={<> Você tem competidores em mãos (na barra abaixo) e um deles irá participar desta rodada.</>}
            en={<> You have a hand of contenders and one of them will participate in this round.</>}
          />
        )}
        {userContenders.length === 0 && (
          <Translate pt={<> Selecione um dos desafios.</>} en={<> Select one of the challenges.</>} />
        )}
        {userContenders.length > 1 && round.current < 5 ? (
          <Translate
            pt={
              <>
                <br />
                Selecione o desafio que você acha que um dos seus competidores tem mais change de vencer.
                <br />
                Você ganha <PointsHighlight>2</PointsHighlight> pontos se ele(a) vencer.
              </>
            }
            en={
              <>
                <br />
                Select a challenge you think one of your contenders have the best chance of winning.
                <br />
                You get <PointsHighlight>2</PointsHighlight> points if they win.
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
      </RuleInstruction>

      <SpaceContainer>
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
      </SpaceContainer>

      {round.current < 5 && userContenders.length > 1 && <ContendersHand contenders={userContenders} />}
    </Step>
  );
}
