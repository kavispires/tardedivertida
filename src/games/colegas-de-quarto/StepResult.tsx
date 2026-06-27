import { useMemo } from 'react';
// Ant Design Resources
import { Divider } from 'antd';
// Types
import type { GameRound, GamePlayers } from 'types/game';
// Components
import { TimedButton } from '@components/buttons/TimedButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { BoardEntry, HouseHappiness } from './utils/types';
import { HouseItem } from './components/HouseItem';
import { HappinessHighlight } from './components/Highlights';
import { HappinessTracker } from './components/HappinessTracker';

type StepResultProps = {
  players: GamePlayers;
  board: BoardEntry[];
  foundTarget: UID[];
  targetId: string;
  round: GameRound;
  happiness: HouseHappiness;
  goToNextStep: () => void;
};

export function StepResult({
  board,
  players,
  foundTarget,
  targetId,
  round,
  happiness,
  goToNextStep,
}: StepResultProps) {
  const itemsDict = useMemo(() => {
    return board.reduce((acc: Dictionary<BoardEntry>, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [board]);

  const finalItemPoints = 3 * foundTarget.length;

  return (
    <Step
      fullWidth
      hidePlayersBar
    >
      <StepTitle size="small">
        {foundTarget.length > 0 ? (
          <Translate
            pt="Vocês estão em harmonia e compraram o item que faltava!"
            en="You are in harmony and bought the only item no one hates!"
          />
        ) : (
          <Translate
            pt="Vixi, cada um escolheu uma coisa, vocês querem mesmo ser colegas de quarto?"
            en="Oops, each of you chose something different, do you really want to be roommates?"
          />
        )}
      </StepTitle>

      <SpaceContainer>
        <HouseItem
          index={Number(targetId)}
          setId={round.current}
          text={itemsDict[targetId].text}
        />
      </SpaceContainer>

      <RuleInstruction type="event">
        {foundTarget.length > 0 ? (
          <>
            <Translate
              pt="Graças aos jogadores"
              en="Thanks to the players"
            />{' '}
            {foundTarget.map((playerId, index) => (
              <span key={playerId}>
                <PlayerAvatarName
                  player={players[playerId]}
                  size="small"
                />
                {index < foundTarget.length - 2 ? ', ' : index === foundTarget.length - 2 ? ' e ' : ''}
              </span>
            ))}{' '}
            {foundTarget.length > 0 && (
              <Translate
                pt={
                  <>
                    {' '}
                    que acertaram a coisa final e aumentaram a felicidade da casa em{' '}
                    <HappinessHighlight>{finalItemPoints} pontos</HappinessHighlight>
                  </>
                }
                en={
                  <>
                    {' '}
                    who got the final thing right and increased the house's happiness by{' '}
                    <HappinessHighlight>{finalItemPoints} points</HappinessHighlight>
                  </>
                }
              />
            )}
            <br />
          </>
        ) : (
          <>
            <Translate
              pt="Ninguém acertou a coisa final, a felicidade da casa não aumentou."
              en="No one got the final thing right, the house's happiness did not increase."
            />
            <br />
          </>
        )}
        <Translate
          pt={
            <>
              Ganhamos{' '}
              <HappinessHighlight>
                {(happiness.gained.at(-1) ?? 0) - finalItemPoints} pontos
              </HappinessHighlight>{' '}
              adicionais por jogadores adivinhando a pista um dos outros.
            </>
          }
          en={
            <>
              We earned{' '}
              <HappinessHighlight>
                {(happiness.gained.at(-1) ?? 0) - finalItemPoints} points
              </HappinessHighlight>{' '}
              from players guessing each other's clues.
            </>
          }
        />
      </RuleInstruction>

      <HappinessTracker happiness={happiness} />

      <Divider />

      <TimedButton
        onClick={goToNextStep}
        onExpire={goToNextStep}
        duration={15}
      >
        <Translate
          pt="Continuar"
          en="Continue"
        />
      </TimedButton>
    </Step>
  );
}
