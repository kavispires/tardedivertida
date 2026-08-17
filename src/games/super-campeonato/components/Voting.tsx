import { motion } from 'motion/react';
import { useMemo } from 'react';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useCountdown } from '@hooks/useCountdown';
import { useMock } from '@hooks/useMock';
import { useStep } from '@hooks/useStep';
// Icons
import { VersusIcon } from '@icons/VersusIcon';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { TransparentButton } from '@components/buttons/TransparentButton';
import { CharacterCard, type OverlayColor } from '@components/cards/CharacterCard';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import type { Bet, Bracket, BracketTier, SubmitBattleVotesPayload } from '../utils/type';
import { useBracketVoting } from '../utils/useBracketVoting';
import { mockVotes } from '../utils/mock';
import { TierContenders } from './TierContenders';

const MotionButton = motion.create(TransparentButton);

type VotingProps = {
  brackets: Bracket[];
  tier: BracketTier;
  onSubmitVotes: (payload: SubmitBattleVotesPayload) => void;
  players: GamePlayers;
  bets: Bet;
};

export function Voting({ brackets, tier, onSubmitVotes, players, bets }: VotingProps) {
  const { step, goToNextStep } = useStep(0);

  const { seconds } = useCountdown({
    duration: 5,
    autoStart: true,
    onExpire: goToNextStep,
  });

  const bracketedContenders: Bracket[][] = useMemo(
    () =>
      brackets
        .filter((entry) => entry.tier === tier)
        .map((entry, index, arr) => {
          if (index % 2 === 0) {
            return [entry, arr[index + 1]];
          }
          return [];
        })
        .filter((entry) => entry.length > 0),
    [brackets, tier],
  );

  const { votes, updateVote, isComplete, checkActiveVote } = useBracketVoting(tier);

  const colors = getContenderColor(tier);

  useMock(() => {
    onSubmitVotes({ votes: mockVotes(bracketedContenders, bets) });
  });

  return (
    <StepSwitcher
      step={step}
      players={players}
    >
      {/* Step 0 */}
      <Surface
        contained
        className="mb-4"
      >
        <p>
          {tier === 'quarter' ? (
            <Translate
              pt="Competidores:"
              en="Contenders:"
            />
          ) : (
            <Translate
              pt="Foram para a próxima fase:"
              en="Moved to the next bracket:"
            />
          )}
        </p>
        <TierContenders contenders={bracketedContenders} />
        <p>
          <Translate
            pt={`Votação começando em ${seconds}`}
            en={`Voting starting in ${seconds}`}
          />
        </p>
      </Surface>

      {/* Step 1 */}
      <div>
        <ul className="w-voting-group">
          {bracketedContenders.map((contenderPair) => (
            <VotingOptions
              key={`${contenderPair[0].id}-${contenderPair[1].id}`}
              left={contenderPair[0]}
              right={contenderPair[1]}
              onClick={updateVote}
              colorLeft={colors.left}
              colorRight={colors.right}
              checkActiveVote={checkActiveVote}
            />
          ))}
        </ul>

        <SpaceContainer>
          <SendButton
            size="large"
            onClick={() => onSubmitVotes({ votes })}
            disabled={!isComplete}
          >
            <Translate
              pt="Enviar votos"
              en="Submit votes"
            />
          </SendButton>
        </SpaceContainer>
      </div>
    </StepSwitcher>
  );
}

const CONTENDER_BATTLE_SIZE = 160;

type VotingOptionsProps = {
  left: Bracket;
  right: Bracket;
  onClick: (left: Bracket) => void;
  colorLeft: OverlayColor;
  colorRight: OverlayColor;
  checkActiveVote: (pos: number) => boolean;
};

function VotingOptions({ left, right, colorLeft, colorRight, onClick, checkActiveVote }: VotingOptionsProps) {
  return (
    <li className="w-voting-options">
      <MotionButton
        onClick={() => onClick(left)}
        active={checkActiveVote(left.position)}
        className="w-vote"
        activeClass="w-vote--active"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <CharacterCard
          size={CONTENDER_BATTLE_SIZE}
          character={left}
          overlayColor={colorLeft}
        />
      </MotionButton>
      <motion.span
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 10,
          delay: 0.5,
        }}
      >
        <Icon
          icon={<VersusIcon />}
          size="large"
        />
      </motion.span>
      <MotionButton
        onClick={() => onClick(right)}
        active={checkActiveVote(right.position)}
        className="w-vote"
        activeClass="w-vote--active"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <CharacterCard
          size={CONTENDER_BATTLE_SIZE}
          character={right}
          overlayColor={colorRight}
        />
      </MotionButton>
    </li>
  );
}

const getContenderColor = (tier: BracketTier): { left: OverlayColor; right: OverlayColor } => {
  switch (tier) {
    case 'quarter':
      return {
        left: 'red',
        right: 'blue',
      };
    case 'semi':
      return {
        left: 'green',
        right: 'orange',
      };
    default:
      return {
        left: 'red',
        right: 'blue',
      };
  }
};
