import clsx from 'clsx';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockPlayerDecision } from './utils/mock';
// Components
import { CandyCount } from './components/CandyCount';
import { PlayerStats } from './components/PlayerStats';
import { CardCountExplanation, DecisionExplanation } from './components/RulesBlobs';
import { Street } from './components/Street';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { TransparentButton } from 'components/buttons';
import { WalkIcon } from 'components/icons/WalkIcon';
import { HouseIcon } from 'components/icons/HouseIcon';
import { IconAvatar } from 'components/icons/IconAvatar';
import { CandyHighlight, TitleIPadHighlight } from './components/Highlights';
import { getAnimationClass } from 'utils/helpers';
import { PlayersDecisionState } from './components/PlayersDecisionState';
import { NewHouseCard } from './components/NewHouseCard';

type StepMakeDecisionProps = {
  players: GamePlayers;
  user: GamePlayer;
  street: NStreet;
  currentCard: NCard;
  onSubmitDecision: GenericFunction;
  continuingPlayerIds: PlayerId[];
  alreadyAtHomePlayerIds: PlayerId[];
  candySidewalk: CandySidewalk;
  totalCandyInSidewalk: number;
  candyInHand: number;
  candyPerPlayer: number;
  cashedInCandy: number;
};

export function StepMakeDecision({
  players,
  street,
  currentCard,
  candySidewalk,
  totalCandyInSidewalk,
  continuingPlayerIds,
  alreadyAtHomePlayerIds,
  onSubmitDecision,
  user,
  candyPerPlayer,
  candyInHand,
}: StepMakeDecisionProps) {
  const { language } = useLanguage();
  const { isLoading } = useLoading();

  // DEV: make decision
  useMock(() => {
    console.log('MOCK!');
    if (user.isTrickOrTreating && !user.ready) {
      console.log('MOCKING');
      onSubmitDecision({
        decision: mockPlayerDecision(street.filter((card) => card.type === 'horror').length, user.hand),
      });
    }
  }, [user.isTrickOrTreating, user.ready]);

  return (
    <Step fullWidth className="n-step-trick-or-treat">
      <Title size="medium" white className={clsx('n-title', getAnimationClass('tada'))} level={2}>
        <Translate pt="Continua ou Volta pra Casa?" en="Next House or Go Home?" />
      </Title>

      <Title size="small" white level={3} className="n-subtitle">
        {currentCard.type === 'candy' && (
          <Translate
            pt={
              <>
                Que delícia! <CandyHighlight>{currentCard.value}</CandyHighlight>! Cada criança ganha{' '}
                <CandyHighlight type="positive">{candyPerPlayer}</CandyHighlight> !
              </>
            }
            en={
              <>
                Yummy! <CandyCount candyCount={currentCard.value} size="large" />! {candyPerPlayer} for each
                one of us!
              </>
            }
          />
        )}
        {currentCard.type === 'horror' && (
          <Translate
            pt={`Ahh! Cruz credo! Um(a) ${currentCard.name[language]} super assustador(a)!`}
            en={`Ahh! Yikes! A very scary ${currentCard.name[language]}!`}
          />
        )}
        {currentCard.type === 'jackpot' && (
          <Translate
            pt={
              <>
                Um <TitleIPadHighlight>iPad</TitleIPadHighlight>! Mas somente uma criança pode ficar com
                ele...
              </>
            }
            en={
              <>
                An <TitleIPadHighlight>iPad</TitleIPadHighlight>! But only one kid can keep it...
              </>
            }
          />
        )}
      </Title>

      <PopoverRule content={<CardCountExplanation />} />

      <PlayersDecisionState
        players={players}
        goingHomePlayerIds={[]}
        continuingPlayerIds={continuingPlayerIds}
        alreadyAtHomePlayerIds={alreadyAtHomePlayerIds ?? []}
        cashedInCandy={0}
        candyInHand={candyInHand}
        phase="TRICK_OR_TREAT"
      />

      <Street street={street} currentCard={currentCard} candySidewalk={candySidewalk} />

      <NewHouseCard card={currentCard} />

      {user.isTrickOrTreating ? (
        <DecisionExplanation user={user} totalCandyInSidewalk={totalCandyInSidewalk} />
      ) : (
        <Instruction contained>
          <Translate
            pt={
              <>
                Essa é a nova casa! Mas você já voltou para sua casa, então, apenas observe.
                <br />
                Você não tem que fazer nada.
              </>
            }
            en={
              <>
                A new house! But you are already home, so, just chill.
                <br />
                You don't have to do anything.
              </>
            }
          />
        </Instruction>
      )}

      {user.isTrickOrTreating && !user.ready && (
        <div className="n-decision-buttons-container">
          <TransparentButton
            className="n-decision-button n-decision-button--home"
            onClick={() => onSubmitDecision({ decision: 'GO_HOME' })}
            disabled={isLoading || user.ready}
          >
            <IconAvatar icon={<HouseIcon />} size="large" />
            <Translate pt="Voltar pra casa" en="Go back home" />
          </TransparentButton>
          <TransparentButton
            className="n-decision-button n-decision-button--continue"
            onClick={() => onSubmitDecision({ decision: 'CONTINUE' })}
            disabled={isLoading || user.ready}
          >
            <IconAvatar icon={<WalkIcon />} size="large" />
            <Translate pt="Continuar para a próxima casa" en="Continue trick or treating" />
          </TransparentButton>
        </div>
      )}

      <PlayerStats user={user} omitDecision={!user.ready} />
    </Step>
  );
}
