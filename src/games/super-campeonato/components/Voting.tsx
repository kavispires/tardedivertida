import { useMemo } from 'react';
import clsx from 'clsx';
// Ant Design resources
import { Button, Space } from 'antd';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useMock } from 'hooks/useMock';
import { useStep } from 'hooks/useStep';
import { useBracketVoting } from '../utils/useBracketVoting';
// Utils
import { getAnimationClass } from 'utils/helpers';
import { mockVotes } from '../utils/mock';
// Components
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ContenderCard } from './ContenderCard';
import { TierContenders } from './TierContenders';

type VotingProps = {
  brackets: WBracket[];
  tier: WBracketTier;
  onSubmitVotes: GenericFunction;
  players: GamePlayers;
  bets: WBets;
};

export function Voting({ brackets, tier, onSubmitVotes, players, bets }: VotingProps) {
  const { step, goToNextStep } = useStep(0);

  const { seconds } = useCountdown({
    duration: 5,
    autoStart: true,
    onExpire: goToNextStep,
  });

  const bracketedContenders: WBracket[][] = useMemo(
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
    [brackets, tier]
  );

  const { votes, updateVote, isComplete, checkActiveVote } = useBracketVoting(tier);

  const colors = getContenderColor(tier);

  useMock(() => {
    onSubmitVotes({ votes: mockVotes(bracketedContenders, bets) });
  });

  return (
    <StepSwitcher step={step} players={players}>
      {/* Step 0 */}
      <Instruction contained>
        <p>
          {tier === 'quarter' ? (
            <Translate pt="Competidores:" en="Contenders:" />
          ) : (
            <Translate pt="Foram para a próxima fase:" en="Moved to the next bracket:" />
          )}
        </p>
        <TierContenders contenders={bracketedContenders} />
        <p>
          <Translate pt={<>Votação começando em {seconds}</>} en={<>Voting starting in {seconds}</>} />
        </p>
      </Instruction>

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

        <Space className="space-container">
          <Button type="primary" size="large" onClick={() => onSubmitVotes({ votes })} disabled={!isComplete}>
            <Translate pt="Enviar votos" en="Submit votes" />
          </Button>
        </Space>
      </div>
    </StepSwitcher>
  );
}

type VotingOptionsProps = {
  left: WBracket;
  right: WBracket;
  onClick: GenericFunction;
  colorLeft: string;
  colorRight: string;
  checkActiveVote: (pos: number) => boolean;
};

function VotingOptions({ left, right, colorLeft, colorRight, onClick, checkActiveVote }: VotingOptionsProps) {
  return (
    <li className={clsx('w-voting-options', getAnimationClass('flipInX'))}>
      <TransparentButton
        onClick={() => onClick(left)}
        active={checkActiveVote(left.position)}
        className="w-vote"
        activeClass="w-vote--active"
      >
        <ContenderCard size={200} contender={left} overlayColor={colorLeft} />
      </TransparentButton>
      <span className="w-voting-options__vs">VS</span>
      <TransparentButton
        onClick={() => onClick(right)}
        active={checkActiveVote(right.position)}
        className="w-vote"
        activeClass="w-vote--active"
      >
        <ContenderCard size={200} contender={right} overlayColor={colorRight} />
      </TransparentButton>
    </li>
  );
}

const getContenderColor = (tier: WBracketTier) => {
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
