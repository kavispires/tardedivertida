// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Icons
import { AnimatedWaitingDotsIcon } from '@icons/AnimatedWaitingDotsIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { OngoingEffect, FestaJuninaCard, SubmitCardPayload } from './utils/types';
import { PLAYER_STATUS } from './utils/constants';
import { Summary } from './components/Summary';
import { PlayArea } from './components/PlayArea';
import { DeckExplanation } from './components/DeckExplanation';
import { NonPlayingUserArea, PlayingUserArea, EliminatedUserArea } from './components/UserAreas';

type StepPlayProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<FestaJuninaCard>;
  turnOrder: GameOrder;
  gameOrder: GameOrder;
  startingPlayerId: UID;
  discardPile: UID[];
  cardsSetAside: UID[];
  effectKeyword: string | null;
  activePlayerId: UID;
  nextDrawnCardId: UID;
  targetPlayersIds: UID[];
  outcome: string;
  activePlayer: GamePlayer;
  isTheActivePlayer: boolean;
  deck: UID[];
  ongoingEffects: OngoingEffect[];
  onSubmitCard: (payload: SubmitCardPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepPlay({
  announcement,
  cardsDict,
  user,
  deck,
  turnOrder,
  gameOrder,
  activePlayer,
  players,
  cardsSetAside,
  discardPile,
  nextDrawnCardId,
  isTheActivePlayer,
  ongoingEffects,
  onSubmitCard,
}: StepPlayProps) {
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Hora do Correio Elegante"
          en="Elegant Mail Time"
        />
      </StepTitle>

      <Summary
        user={user}
        ongoingEffects={ongoingEffects}
        players={players}
        deck={deck}
        turnOrder={turnOrder}
        activePlayerId={activePlayer.id}
        discardPile={discardPile}
        cardsSetAside={cardsSetAside}
      />

      <PlayArea
        players={players}
        gameOrder={gameOrder}
        activePlayerId={activePlayer.id}
        waitingForPlayerId={activePlayer.id}
        user={user}
        userArea={
          <>
            {user.hand && isTheActivePlayer && (
              <PlayingUserArea
                cardsDict={cardsDict}
                user={user}
                nextDrawnCardId={nextDrawnCardId}
                onSubmitCard={onSubmitCard}
              />
            )}

            {user.hand && user.status !== PLAYER_STATUS.ELIMINATED && !isTheActivePlayer && (
              <NonPlayingUserArea
                cardsDict={cardsDict}
                user={user}
              />
            )}

            {user.status === PLAYER_STATUS.ELIMINATED && <EliminatedUserArea />}
          </>
        }
      >
        {isTheActivePlayer ? (
          <RuleInstruction type="action">
            <Translate
              pt="Escolha uma das duas cartas para jogar.
              <br/>
              Lembre-se que se você quer manter na sua mão uma carta que te ajude a ganhar no final da rodada (carta de maior valor).
              <br/>
              Qualquer efeito que faça alguém (incluindo você) descartar a carta que você deixou em mãos, sem poder comprar uma nova, faz você perder a rodada!"
              en="Pick one of the two cards to play.
              <br/>
              Remember that if you want to keep in your hand a card that helps you win by the end of the round(highest value card).
              <br/>
              Any effect that makes someone (including you) discard the card in hand without being able to draw a new one makes you lose the round!"
            />
          </RuleInstruction>
        ) : (
          <Flex
            vertical
            align="center"
            className="my-10 contained"
          >
            <Icon
              icon={<AnimatedWaitingDotsIcon />}
              size="large"
            />
            <p>
              <Translate
                en="Waiting for {player} to play their card"
                pt="Aguardando {player} jogar a carta"
                values={{
                  player: <PlayerAvatarName player={activePlayer} />,
                }}
              />
            </p>
          </Flex>
        )}
      </PlayArea>

      <DeckExplanation cardsDict={cardsDict} />
    </Step>
  );
}
