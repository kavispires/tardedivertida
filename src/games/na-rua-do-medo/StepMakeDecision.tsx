// Hooks
import { useLanguage, useMock } from '../../hooks';
// Utils
import { mockPlayerDecision } from './mock';
// Components
import {
  AvatarIcon,
  Instruction,
  PopoverRule,
  ReadyPlayersBar,
  Step,
  Title,
  Translate,
  TransparentButton,
} from '../../components';
import { CandyCount } from './CandyCount';
import { PlayersDecisionList } from './PlayersDecisionList';
import { PlayerStats } from './PlayerStats';
import { CardCountExplanation, DecisionExplanation } from './RulesBlobs';
import { Street } from './Street';

type StepMakeDecisionProps = {
  players: GamePlayers;
  user: GamePlayer;
  street: NStreet;
  currentCard: NCard;
  candySidewalk: CandySidewalk;
  totalCandyInSidewalk: number;
  continuingPlayerIds: PlayerId[];
  onSubmitDecision: GenericFunction;
  candyPerPlayer: number;
};

export function StepMakeDecision({
  players,
  street,
  currentCard,
  candySidewalk,
  totalCandyInSidewalk,
  continuingPlayerIds,
  onSubmitDecision,
  user,
  candyPerPlayer,
}: StepMakeDecisionProps) {
  const { language } = useLanguage();

  // DEV: make decision
  useMock(() => {
    if (user.isTrickOrTreating) {
      onSubmitDecision({
        decision: mockPlayerDecision(street.filter((card) => card.type === 'horror').length, user.hand),
      });
    }
  }, []);

  return (
    <Step fullWidth>
      <Title>
        {currentCard.type === 'candy' && (
          <Translate
            pt={
              <>
                Que delícia! <CandyCount candyCount={currentCard.value} size="large" />! {candyPerPlayer} para
                cada!
              </>
            }
            en={
              <>
                Yummy! {currentCard.value} <AvatarIcon type="candy" />! Each player gets {candyPerPlayer}{' '}
                <AvatarIcon type="candy" />!
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
            pt={`Um iPad! Mas somente uma pessoa pode ficar com ele...`}
            en={`An iPad! But only one person can keep it...`}
          />
        )}
      </Title>

      <PopoverRule content={<CardCountExplanation />} />

      <PlayersDecisionList players={players} type="walk" playersIdsList={continuingPlayerIds} />

      <Street street={street} currentCard={currentCard} candySidewalk={candySidewalk} />

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

      {user.isTrickOrTreating && (
        <div className="n-decision-buttons-container">
          <TransparentButton
            className="n-decision-button n-decision-button--home"
            onClick={() => onSubmitDecision({ decision: 'GO_HOME' })}
          >
            <AvatarIcon type="house" size="large" />
            <Translate pt="Voltar pra casa" en="Go back home" />
          </TransparentButton>
          <TransparentButton
            className="n-decision-button n-decision-button--continue"
            onClick={() => onSubmitDecision({ decision: 'CONTINUE' })}
          >
            <AvatarIcon type="walk" size="large" />
            <Translate pt="Continuar para a próxima casa" en="Continue trick or treating" />
          </TransparentButton>
        </div>
      )}

      <ReadyPlayersBar players={players} />

      <PlayerStats user={user} omitDecision />
    </Step>
  );
}
