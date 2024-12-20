import clsx from "clsx";
import { shuffle } from "lodash";
import { useCallback, useState } from "react";
import { useEffectOnce } from "react-use";
// Ant Design Resources
import { Button, Space } from "antd";
// Types
import type { GameRound } from "types/game";
import type { GamePlayer, GamePlayers } from "types/player";
// Hooks
import { useCardWidth } from "hooks/useCardWidth";
import { useLoading } from "hooks/useLoading";
import { useMock } from "hooks/useMock";
import { useVotingMatch } from "hooks/useVotingMatch";
// Utils
import { getEntryId, sortPlayers } from "utils/helpers";
// Components
import { TransparentButton } from "components/buttons";
import { Translate } from "components/language";
import { RibbonGroup } from "components/ribbons";
import { Step, type StepProps } from "components/steps";
import { RuleInstruction, Title } from "components/text";
// Internal
import type { Characters } from "./utils/types";
import { getRibbons, prepareGuesses } from "./utils/helpers";
import { ScoringRules } from "./components/RulesBlobs";
import { PlayerGlyphs } from "./components/PlayerGlyphs";
import { Card } from "./components/Card";

type StepGuessingProps = {
  user: GamePlayer;
  players: GamePlayers;
  onSubmitGuesses: GenericFunction;
  characters: Characters;
  tableOrder: CardId[];
  round: GameRound;
  imageCardMode: boolean;
} & Pick<StepProps, "announcement">;

export function StepGuessing({
  user,
  announcement,
  onSubmitGuesses,
  players,
  characters,
  tableOrder,
  round,
  imageCardMode,
}: StepGuessingProps) {
  const { isLoading } = useLoading();
  const glyphWidth = useCardWidth(20, {
    gap: 16,
    minWidth: 45,
    maxWidth: 60,
  });
  const characterWidth = useCardWidth(8, {
    gap: 16,
    minWidth: 120,
    maxWidth: 200,
  });
  const { votes, setVotes, activateItem, isVotingComplete, isItemActive } =
    useVotingMatch("player", true, Object.keys(players).length, {});
  const [choseRandomly, setChoseRandomly] = useState(false);

  const onGuessForMe = () => {
    setChoseRandomly(true);
    const usedPlayers = Object.keys(votes);
    const usedCharacters = Object.values(votes);
    const playerKeys = Object.keys(players)
      .map((playerId: string) => getEntryId(["player", playerId]))
      .filter((key: string) => !usedPlayers.includes(key));
    const characterKeys = shuffle(
      Object.keys(characters)
        .map((cardId: CardId) => getEntryId(["char", cardId]))
        .filter((key: string) => !usedCharacters.includes(key)),
    );
    const newVotes = { ...votes };
    playerKeys.forEach((playerKey: string, index: number) => {
      if (!newVotes[playerKey]) {
        newVotes[playerKey] = characterKeys[index];
      }
    });
    setVotes(newVotes);
    return newVotes;
  };

  const selectOwnCard = useCallback(() => {
    if (user.character) {
      return {
        [getEntryId(["player", user.id])]: getEntryId([
          "char",
          user.character.id,
        ]),
      };
    }
  }, [user]);

  // Dev Mocks
  useMock(() => {
    onSubmitGuesses({ guesses: prepareGuesses(onGuessForMe()), choseRandomly });
  });

  // Auto-select the players own drawing and word
  useEffectOnce(() => {
    const selection = selectOwnCard();
    if (selection) {
      setVotes((s: any) => ({ ...s, ...selection }));
    }
  });

  const ribbons = getRibbons(players, votes);

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={<>Pareie os cada personagem com um jogador</>}
          en={<>Pair player and characters</>}
        />
      </Title>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              De acordo com a seleção de ícones de cada jogador, tente adivinhar
              todos os pares.
              <br />
              <strong>Clique</strong> em uma das barras de ícones então no
              personagem correspondente.
              <br />
              Para desfazer, basta selecionar normalmente que sua escolha era
              sobreposta.
            </>
          }
          en={
            <>
              Based on each player's glyphs selection, try to guess the pairs.
              <br />
              <strong>Click</strong> on one of the glyph bars and then on the
              corresponding character.
              <br />
              To undo, just select normally that your choice was overridden.
            </>
          }
        />
        <br />
        <ScoringRules currentRound={round.current} />
      </RuleInstruction>

      <div className="q-voting-container">
        <div className="q-voting-characters">
          {tableOrder.map((cardId) => {
            const entryId = getEntryId(["char", cardId]);
            const labels = ribbons[cardId] ?? [];

            return (
              <TransparentButton
                key={cardId}
                onClick={() => activateItem(entryId)}
                active={isItemActive(entryId)}
                className="q-voting-characters__button"
              >
                <RibbonGroup labels={labels} />
                <Card
                  character={characters[cardId]}
                  width={characterWidth}
                  className={clsx(cardId === "a" && "q-character-player")}
                  imageCardMode={imageCardMode}
                />
              </TransparentButton>
            );
          })}
        </div>

        <div className="q-players-glyphs">
          {sortPlayers(players).map((player) => {
            const entryId = getEntryId(["player", player.id]);

            return (
              <TransparentButton
                key={`glyphs-for-${player.id}`}
                onClick={() => activateItem(entryId)}
                active={isItemActive(entryId)}
              >
                <PlayerGlyphs
                  player={player}
                  glyphWidth={glyphWidth}
                  done={Boolean(votes[entryId])}
                />
              </TransparentButton>
            );
          })}
        </div>
      </div>

      <Space className="space-container">
        <Button
          size="large"
          type="primary"
          onClick={() =>
            onSubmitGuesses({ guesses: prepareGuesses(votes), choseRandomly })
          }
          disabled={isLoading || user.ready || !isVotingComplete}
        >
          <Translate pt={<>Enviar pares</>} en={<>Submit guesses</>} />
        </Button>
        <Button
          size="large"
          onClick={() => onGuessForMe()}
          disabled={isLoading || user.ready}
        >
          <Translate pt={<>Desistir</>} en={<>Guess for me</>} />
        </Button>
      </Space>
    </Step>
  );
}
