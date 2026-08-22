import { mockClue } from '@mock/clues';
import { useState } from 'react';
// Ant Design Resources
import { Divider, Input, Space } from 'antd';
// Types
import type { GameRound, GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
import { useMock } from '@hooks/useMock';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { DevButton } from '@components/debug/DevButton';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { BoardEntry, HouseHappiness, PlayerAssignedPair, SubmitCluesPayload } from './utils/types';
import { PAIR_COLORS, PAIR_ICONS } from './utils/helpers';
import { StoreBoard } from './components/StoreBoard';
import { HappinessTracker } from './components/HappinessTracker';

type StepWriteCluesProps = {
  players: GamePlayers;
  user: GamePlayer;
  board: BoardEntry[];
  happiness: HouseHappiness;
  round: GameRound;
  onSubmitClues: (payload: SubmitCluesPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepWriteClues({
  announcement,
  board,
  happiness,
  user,
  players,
  round,
  onSubmitClues,
}: StepWriteCluesProps) {
  const { translate } = useLanguage();
  const assignedPairs: PlayerAssignedPair[] = players[user.id]?.assignedPairs || [];
  const [clues, setClues] = useState<string[]>(assignedPairs.map(() => ''));

  const handleClueChange = (index: number, value: string) => {
    const newClues = [...clues];
    newClues[index] = value.trim();
    setClues(newClues);
  };

  const isComplete = clues.every((clue) => clue.trim().length > 1);

  const handleSubmit = () => {
    if (isComplete) {
      onSubmitClues({ clues });
    }
  };

  useMock(() => {
    onSubmitClues({ clues: assignedPairs.map((pair) => `${mockClue()}-${pair.id}`) });
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Escreva suas pistas"
          en="Write your clues"
        />
      </StepTitle>

      <RuleInstruction type="lore">
        <Translate
          pt="Chegamos a essa loja e cada um de nós tem opiniões sobre {value} coisas que não gostamos e ao invés de comunicarmos de forma saudável e direta, vamos dar dicas aos outros sobre o que não queremos."
          en="We arrived at this store and each of us has opinions about {value} things we don't like and instead of communicating in a healthy and direct way, we will give hints to others about what we don't want."
          values={{
            value: `${assignedPairs.length * 2}`,
          }}
        />
      </RuleInstruction>

      <StoreBoard
        board={board}
        round={round}
        assignedPairs={assignedPairs}
      />

      <RuleInstruction type="action">
        <Translate
          pt="Para cada um dos {value} pares atribuídos a você, escreva uma pista de palavra
              única.
          <br/>
          Essa pista deve ser relacionada ao significado da palavra, não pode conter nenhuma
              palavra na loja ou variações dessas palavras (porta ➜ portão), e não fazer referência à imagem
              ou posição da palavra da grade."
          en="For each of your {value} assigned pairs, write a single-word clue.
          <br/>
          This clue must be related to the meaning of the word, cannot contain any word in the store or
              variations of those words (door ➜ doorway), and cannot refer to the image or position of the
              word on the board."
          values={{
            value: `${assignedPairs.length}`,
          }}
        />
      </RuleInstruction>

      <SpaceFloat style={{ justifyContent: 'center', marginTop: '2rem' }}>
        {assignedPairs.map((assignedPair, index) => (
          <Space.Compact
            size="large"
            key={assignedPair.id}
          >
            <Space.Addon style={{ backgroundColor: PAIR_COLORS[index], color: 'white' }}>
              {PAIR_ICONS[index]}
            </Space.Addon>

            <Input
              placeholder={translate({ pt: 'Escreva sua pista aqui', en: 'Write your clue here' })}
              value={clues[index]}
              onChange={(e) => handleClueChange(index, e.target.value)}
            />
          </Space.Compact>
        ))}

        <SendButton
          size="large"
          disabled={!isComplete}
          onClick={handleSubmit}
        >
          <Translate
            pt="Enviar pistas"
            en="Submit clues"
          />
        </SendButton>

        <DevButton
          onClick={() => onSubmitClues({ clues: assignedPairs.map((pair) => `${mockClue()}-${pair.id}`) })}
        />
      </SpaceFloat>

      <Divider />

      <HappinessTracker happiness={happiness} />
    </Step>
  );
}
