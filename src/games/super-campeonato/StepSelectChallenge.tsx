// Ant Design Resources
import { Divider } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { TextCardData } from 'types/tdr';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import { useMock } from '@hooks/useMock';
// Utils
import { LETTERS } from '@utils/constants';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { CharacterCard } from '@components/cards/CharacterCard';
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { FightingContender, SubmitChallengePayload } from './utils/type';
import { mockSelectChallenge } from './utils/mock';
import { contenderWidthOptions } from './utils/helpers';
import { HandOfCardsHighlight } from './components/Highlights';

type StepSelectChallengeProps = {
  onSubmitChallenge: (payload: SubmitChallengePayload) => void;
  challenges: TextCardData[];
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
  const cardWidth = useCardWidth(Math.max(userContenders.length ?? 9, 5), contenderWidthOptions);

  useMock(() => {
    onSubmitChallenge({ challengeId: mockSelectChallenge(challenges) });
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Selecione o desafio da rodada"
          en="Select the theme for the round"
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt={<>Cada rodada é feita ao redor de um desafio.</>}
          en={<>Each round has a challenge for the contenders to battle on!</>}
        />
        {userContenders.length > 1 && (
          <Translate
            pt={
              <>
                {' '}
                Você tem <HandOfCardsHighlight>{userContenders.length} competidores</HandOfCardsHighlight> em
                mãos (na barra abaixo) e um deles irá participar desta rodada.
              </>
            }
            en={
              <>
                {' '}
                You have a hand of{' '}
                <HandOfCardsHighlight>{userContenders.length} contenders</HandOfCardsHighlight> and one of
                them will participate in this round.
              </>
            }
          />
        )}
        {userContenders.length === 0 && (
          <Translate
            pt={<> Selecione um dos desafios.</>}
            en={<> Select one of the challenges.</>}
          />
        )}
        {userContenders.length > 1 && round.current < 5 ? (
          <Translate
            pt={
              <>
                <br />
                Selecione o desafio que você acha que um dos seus competidores tem mais change de vencer.
                porque você ganha <PointsHighlight value={2} /> se ele(a) vencer.
              </>
            }
            en={
              <>
                <br />
                Select a challenge you think one of your contenders have the best chance of winning because
                you get <PointsHighlight value={2} /> if they win.
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

      <div className="w-challenge-options">
        {challenges.map((challenge, index) => {
          return (
            <TransparentButton
              key={challenge.id}
              onClick={() => onSubmitChallenge({ challengeId: challenge.id })}
              style={{ height: '100%' }}
            >
              <TextCard
                header={LETTERS[index]}
                randomColor
                style={{ height: '100%' }}
              >
                {challenge.text}
              </TextCard>
            </TransparentButton>
          );
        })}
      </div>

      {round.current < 5 && userContenders.length > 1 && (
        <>
          <Divider />
          <TitledContainer
            title={
              <Translate
                pt="Seus competidores"
                en="Your contenders"
              />
            }
          >
            <ul className="w-contenders-hand">
              {userContenders.map((contender) => (
                <li
                  key={contender.id}
                  className="w-contenders-hand__entry"
                >
                  <CharacterCard
                    character={contender}
                    overlayColor="gray"
                    size={cardWidth}
                  />
                </li>
              ))}
            </ul>
          </TitledContainer>
        </>
      )}
    </Step>
  );
}
