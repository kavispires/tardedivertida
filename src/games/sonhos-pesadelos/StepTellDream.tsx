import { useState, useEffect } from 'react';
// Design Resources
import { Button } from 'antd';
// Hooks
import { useLanguage, useLoading } from '../../hooks';
// Utils
import { isDevEnv, shuffle } from '../../utils/helpers';
// Components
import { Card } from '../../components/cards';
import {
  ButtonContainer,
  Instruction,
  ReadyPlayersBar,
  Step,
  Title,
  translate,
  Translate,
} from '../../components';
import { DreamBoardWrite } from './DreamBoardWrite';

const mockedClues = [
  'água',
  'bola',
  'calderão do huck',
  'dedo',
  'esmalte',
  'fatídico',
  'ganhar',
  'hereditário',
  'simpático',
  'abismo',
  'rola',
  'a branca de neve',
  'oops i did it again',
  'pesquisa',
  'saborosa',
  'amargo',
];

type StepTellDreamProps = {
  currentRound: number;
  dreamsCount: Number;
  onSubmitDreams: GenericFunction;
  players: GamePlayers;
  table: STable;
  theme: STheme;
  user: GamePlayer;
};

export function StepTellDream({
  players,
  theme,
  user,
  table,
  onSubmitDreams,
  dreamsCount,
  currentRound,
}: StepTellDreamProps) {
  const [isLoading] = useLoading();
  const language = useLanguage();
  const [localClues, setLocalClues] = useState<PlainObject>({});
  const [hasClues, setHasClues] = useState(false);

  // Verify if player has completed all his clues
  useEffect(() => {
    setHasClues(
      Object.keys(localClues).length === dreamsCount &&
        Object.values(localClues).every((e) => Boolean(e.trim()))
    );
  }, [localClues, dreamsCount]);

  useEffect(() => {
    if (isDevEnv) {
      const shuffledMockedClues = shuffle(mockedClues);
      setLocalClues(
        Object.keys(user.dreams).reduce((acc: PlainObject, cardId, index) => {
          acc[cardId] = shuffledMockedClues[index];
          return acc;
        }, {})
      );
    }
  }, []); // eslint-disable-line

  const onSubmitDreamsClick = () => {
    onSubmitDreams({
      dreams: localClues,
    });
  };

  return (
    <Step fullWidth className="s-tell-dream-step">
      <Title>
        <Card
          header={translate('Tema', 'Theme', language)}
          className="s-theme-card"
          randomColor
          footer={theme.description}
          footerClassName="s-theme-card__description"
        >
          {theme.text}
        </Card>
      </Title>
      <Instruction contained>
        <Translate
          pt="Clique nos botões amarelos para escrever sua(s) dica(s). Quando terminar, aperte Enviar"
          en="Click the yellow buttons to write your clue(s).When you're done, press Submit"
        />
      </Instruction>

      <ButtonContainer>
        <Button type="primary" disabled={isLoading || !hasClues} onClick={onSubmitDreamsClick}>
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </ButtonContainer>

      <DreamBoardWrite
        user={user}
        table={table}
        localClues={localClues}
        setLocalClues={setLocalClues}
        currentRound={currentRound}
      />

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
