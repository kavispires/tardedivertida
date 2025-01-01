import clsx from 'clsx';
import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
import { useVotingMatch } from 'hooks/useVotingMatch';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
// Internal
import type { Dream } from './utils/types';
import { cleanupVotes, selectOwnVote, voteRandomly } from './utils/helpers';
import { mockVotes } from './utils/mock';
import { AllDreamsClues } from './components/AllDreamsClues';
import { DreamBoardVote } from './components/DreamBoardVote';

type StepMatchDreamsProps = {
  onSubmitVotes: GenericFunction;
  players: GamePlayers;
  table: ImageCardId[];
  user: GamePlayer;
  dreams: Dream[];
};

export function StepMatchDreams({ players, user, table, onSubmitVotes, dreams }: StepMatchDreamsProps) {
  const { isLoading } = useLoading();

  const { votes, setVotes, activeItem, activateItem, isVotingComplete } = useVotingMatch(
    'dream',
    true,
    dreams.length,
  );

  // Auto-select own clue
  useEffectOnce(() => {
    const userClues = selectOwnVote(dreams, user);
    if (userClues) {
      setVotes((s: StringDictionary) => ({ ...s, ...userClues }));
    }
  });

  // DEV: Random vote
  useMock(() => {
    onSubmitVotes({
      votes: mockVotes(dreams, table, user),
    });
  }, []);

  const onSubmitDreams = () => {
    onSubmitVotes({
      votes: cleanupVotes(votes, user),
    });
  };

  return (
    <Step fullWidth className="s-tell-dream-step">
      <StepTitle>
        <Translate pt="Adivinhação" en="Match the Pairs" />
      </StepTitle>
      <Instruction contained>
        <Translate
          pt="Clique em uma carta e então uma botão da imagem correspondente ou vice e versa. Aperte enviar quando terminar te combinar todas as dicas."
          en="Click on a clue then on an image button or vice versa. When you're done matching all clues, press Submit."
        />
      </Instruction>

      <Space className="space-container" align="center">
        <Button
          type="default"
          disabled={isLoading}
          onClick={() => setVotes(voteRandomly(votes, dreams, table))}
          className={clsx(isVotingComplete && getAnimationClass('tada'))}
          size="large"
        >
          <Translate pt="Vote pra mim" en="Vote for me" />
        </Button>
        <Button
          type="primary"
          disabled={isLoading || !isVotingComplete}
          onClick={onSubmitDreams}
          className={clsx(isVotingComplete && getAnimationClass('tada'))}
          size="large"
        >
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </Space>

      <DreamBoardVote
        user={user}
        table={table}
        activeItem={activeItem}
        onActivateItem={activateItem}
        votes={votes}
      />

      <AllDreamsClues
        dreams={dreams}
        activeItem={activeItem}
        onActivateItem={activateItem}
        votes={votes}
        players={players}
      />
    </Step>
  );
}
