// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TurnOrder } from 'components/players';
import { Instruction, TextHighlight, StepTitle } from 'components/text';
// Internal
import type { CardEntry } from './utils/types';
import { TableFocus } from './components/TableFocus';
import { YourSelectedCards } from './components/YourSelectedCards';

type StepDefendingWaitingProps = {
  clue: string;
  currentPlayer: GamePlayer;
  table: CardEntry[];
  isUserTheImpostor: boolean;
  user: GamePlayer;
  players: GamePlayers;
  turnOrder: TurnOrder;
};

export function StepDefendingWaiting({
  clue,
  currentPlayer,
  table,
  isUserTheImpostor,
  user,
  players,
  turnOrder,
}: StepDefendingWaitingProps) {
  return (
    <>
      <StepTitle>
        <Translate pt="Pista Secreta era: " en="The Secret Clue was: " />
        <TextHighlight>{clue}</TextHighlight>
      </StepTitle>
      <Instruction contained>
        <AvatarName key={currentPlayer.id} player={currentPlayer} className={getAnimationClass('tada')} />,{' '}
        <Translate pt="explique porque você escolheu as cartas." en="explain why you chose your cards." />
        {isUserTheImpostor && (
          <>
            <br />
            <Translate
              pt=" Suas cartas estão no fim da página pra você começar a já pensar numa desculpa esfarrapada."
              en=" Your cards are displayed in the bottom of the page so you can think of your B.S.'"
            />
          </>
        )}
      </Instruction>

      <SpaceContainer align="center" wrap>
        <TableFocus table={table} currentPlayer={currentPlayer} />
      </SpaceContainer>

      <TurnOrder players={players} activePlayerId={currentPlayer.id} order={turnOrder} />

      <YourSelectedCards table={table} user={user} />
    </>
  );
}
