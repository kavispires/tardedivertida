import clsx from 'clsx';
import { shuffle } from 'lodash';
import { useEffectOnce } from 'react-use';
import { useCallback } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useCardWidth } from 'hooks/useCardWidth';
import { useDelayedMock } from 'hooks/useMock';
import { useVotingMatch } from 'hooks/useVotingMatch';
// Utils
import { getEntryId, sortPlayers } from 'utils/helpers';
import { getRibbons, prepareGuesses } from './utils/helpers';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { TransparentButton } from 'components/buttons';
import { CharacterCard } from './components/CharacterCard';
import { ScoringRules } from './components/RulesBlobs';
import { RibbonGroup } from 'components/ribbons';
import { PlayerGlyphs } from './components/PlayerGlyphs';

type StepGuessingProps = {
  user: GamePlayer;
  players: GamePlayers;
  onSubmitGuesses: GenericFunction;
  characters: Characters;
  tableOrder: CardId[];
  round: GameRound;
} & AnnouncementProps;

export function StepGuessing({
  user,
  announcement,
  onSubmitGuesses,
  players,
  characters,
  tableOrder,
  round,
}: StepGuessingProps) {
  const { isLoading } = useLoading();
  const glyphWidth = useCardWidth(20, 16, 45, 60);
  const characterWidth = useCardWidth(8, 16, 120, 200);
  const { votes, setVotes, activateItem, isVotingComplete, isItemActive } = useVotingMatch(
    'player',
    true,
    Object.keys(players).length,
    {}
  );

  const onGuessForMe = () => {
    const usedPlayers = Object.keys(votes);
    const usedCharacters = Object.values(votes);
    const playerKeys = Object.keys(players)
      .map((playerId: string) => getEntryId(['player', playerId]))
      .filter((key: string) => !usedPlayers.includes(key));
    const characterKeys = shuffle(
      Object.keys(characters)
        .map((cardId: CardId) => getEntryId(['char', cardId]))
        .filter((key: string) => !usedCharacters.includes(key))
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
      return { [getEntryId(['player', user.id])]: getEntryId(['char', user.character.id]) };
    }
  }, [user]);

  // Dev Mocks
  useDelayedMock(() => {
    onSubmitGuesses({ guesses: prepareGuesses(onGuessForMe()) });
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
        <Translate pt={<>Pareie os cada personagem com um jogador</>} en={<>Pair player and characters</>} />
      </Title>

      <Instruction contained>
        <Translate
          pt={<>De acordo com a seleção de ícones de cada jogador, tente adivinhar todos os pares.</>}
          en={<>Based on each player's glyphs selection, try to guess the pairs.</>}
        />
        <br />
        <ScoringRules currentRound={round.current} />
      </Instruction>

      <div className="q-voting-container">
        <div className="q-voting-characters">
          {tableOrder.map((cardId) => {
            const entryId = getEntryId(['char', cardId]);
            const labels = ribbons[cardId] ?? [];

            return (
              <TransparentButton
                key={cardId}
                onClick={() => activateItem(entryId)}
                active={isItemActive(entryId)}
                className="q-voting-characters__button"
              >
                <RibbonGroup labels={labels} />
                <CharacterCard
                  character={characters[cardId]}
                  size={characterWidth}
                  className={clsx(cardId === 'a' && 'q-character-player')}
                />
              </TransparentButton>
            );
          })}
        </div>

        <div className="q-players-glyphs">
          {sortPlayers(players).map((player) => {
            const entryId = getEntryId(['player', player.id]);

            return (
              <TransparentButton
                key={`glyphs-for-${player.id}`}
                onClick={() => activateItem(entryId)}
                active={isItemActive(entryId)}
              >
                <PlayerGlyphs player={player} glyphWidth={glyphWidth} done={Boolean(votes[entryId])} />
              </TransparentButton>
            );
          })}
        </div>
      </div>

      <Space className="space-container">
        <Button
          size="large"
          type="primary"
          onClick={() => onSubmitGuesses({ guesses: prepareGuesses(votes) })}
          disabled={isLoading || user.ready || !isVotingComplete}
        >
          <Translate pt={<>Enviar pares</>} en={<>Submit guesses</>} />
        </Button>
        <Button size="large" onClick={() => onGuessForMe()} disabled={isLoading || user.ready}>
          <Translate pt={<>Desistir</>} en={<>Submit glyphs</>} />
        </Button>
      </Space>
    </Step>
  );
}
