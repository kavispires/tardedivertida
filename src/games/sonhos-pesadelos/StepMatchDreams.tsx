import clsx from 'clsx';
import { useEffect } from 'react';
// Ant Design Resources
import { Button } from 'antd';
// Hooks
import { useLanguage, useLoading, useMock, useVotingMatch } from 'hooks';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { ButtonContainer, Instruction, ReadyPlayersBar, Step, Title, Translate } from 'components';
import { AllDreamsClues } from './AllDreamsClues';
import { DreamBoardVote } from './DreamBoardVote';
import { cleanupVotes, selectOwnVote, voteRandomly } from './helpers';
import { mockVotes } from './mock';

type StepMatchDreamsProps = {
  onSubmitVotes: GenericFunction;
  players: GamePlayers;
  table: ImageCard[];
  user: GamePlayer;
  dreams: SDream[];
};

export function StepMatchDreams({ players, user, table, onSubmitVotes, dreams }: StepMatchDreamsProps) {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();

  const { votes, setVotes, activeItem, activateItem, isVotingComplete } = useVotingMatch(
    'dream',
    true,
    dreams.length
  );

  // Auto-select own clue
  useEffect(() => {
    const userClues = selectOwnVote(dreams, user);
    if (userClues) {
      setVotes((s: StringDictionary) => ({ ...s, ...userClues }));
    }
  }, []); //eslint-disable-line

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
      <Title>{translate('Adivinhação', 'Match the Pairs')}</Title>
      <Instruction contained>
        <Translate
          pt="Clique em uma carta e então uma botão da imagem correspondente ou vice e versa. Aperte enviar quando terminar te combinar todas as dicas."
          en="Click on a clue then on an image button or vice versa. When you're done matching all clues, press Submit."
        />
      </Instruction>

      <ButtonContainer>
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
      </ButtonContainer>

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

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
