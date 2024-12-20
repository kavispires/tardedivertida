import { useEffect, useState } from "react";
// Ant Design Resources
import { App, Space } from "antd";
// Types
import type { GamePlayer, GamePlayers } from "types/player";
// Hooks
import { useLanguage } from "hooks/useLanguage";
// Utils
import { getAnimationClass } from "utils/helpers";
// Components
import { AvatarName } from "components/avatars";
import { Translate } from "components/language";
import { TurnOrder } from "components/players";
import { messageContent } from "components/pop-up";
import { Instruction, TextHighlight, Title } from "components/text";
// Internal
import type { CardEntry } from "./utils/types";
import { EndDefenseTimedButton } from "./components/EndDefenseTimedButton";
import { TableFocus } from "./components/TableFocus";
import { YourSelectedCards } from "./components/YourSelectedCards";

type StepDefendingActionProps = {
  clue: string;
  currentPlayer: GamePlayer;
  table: CardEntry[];
  onFinishDefenseClick: GenericFunction;
  isLoading: boolean;
  isUserTheImpostor: boolean;
  user: GamePlayer;
  players: GamePlayers;
  turnOrder: TurnOrder;
};

export function StepDefendingAction({
  clue,
  currentPlayer,
  table,
  onFinishDefenseClick,
  isLoading,
  isUserTheImpostor,
  user,
  players,
  turnOrder,
}: StepDefendingActionProps) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const [wasMessageDisplayed, setWasMessageDisplayed] = useState(false);

  useEffect(() => {
    if (
      !wasMessageDisplayed &&
      !isLoading &&
      Date.now() - user.updatedAt > 3000000
    ) {
      message.info(
        messageContent(
          translate(
            "Sua vez de defender suas escolhas!",
            "It's your turn to defend your choices",
          ),
          translate(
            "Aperte o botão Concluir Defesa quando terminar",
            "Press the button End Defense when you're done",
          ),

          currentPlayer?.id,
          4,
        ),
      );
      setWasMessageDisplayed(true);
    }
  }, [
    wasMessageDisplayed,
    message,
    currentPlayer?.id,
    translate,
    isLoading,
    user.updatedAt,
  ]);

  return (
    <>
      <Title>
        <Translate pt="Pista Secreta era: " en="The Secret Clue was: " />
        <TextHighlight>{clue}</TextHighlight>
      </Title>
      <Instruction contained>
        <AvatarName
          key={currentPlayer.id}
          player={currentPlayer}
          className={getAnimationClass("tada")}
        />
        ,{" "}
        <Translate
          pt="explique porque você escolheu as cartas."
          en="explain why you chose your cards."
        />
        <Translate
          pt=" Quando terminar sua defesa, aperte concluir."
          en=" When you're done, press 'End Defense'."
        />
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

      <EndDefenseTimedButton
        onFinishDefenseClick={onFinishDefenseClick}
        isLoading={isLoading}
      />

      <Space className="space-container" align="center" wrap>
        <TableFocus table={table} currentPlayer={currentPlayer} />
      </Space>

      <TurnOrder
        players={players}
        activePlayerId={currentPlayer.id}
        order={turnOrder}
      />

      <YourSelectedCards table={table} user={user} />
    </>
  );
}
