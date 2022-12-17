import { PlusCircleFilled } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { Avatar } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useState } from 'react';
import { AVATARS, BOTS_LIST } from 'utils/avatars';
import { INSTRUCTIONS } from './utils/constants';

export const TaskCruzaPalavras = ({ task, onSubmitTask, user }: TaskProps) => {
  const { dualTranslate } = useLanguage();
  const { isLoading } = useLoading();
  const [selection, setSelection] = useState(0);

  return (
    <>
      <Title size="small">{dualTranslate(INSTRUCTIONS[task.game])}</Title>
      <Instruction contained>
        <Translate
          pt={<>Alguém escreveu a dica abaixo, onde ela se encaixa na grade?</>}
          en={<>Someone wrote the clue below, where does it fit in the grid?</>}
        />
      </Instruction>

      <div className={'x-clue-card'} style={{ borderColor: 'red' }}>
        <span className={'x-clue-card__icon color-background--red'} style={{ backgroundColor: 'red' }}>
          <Avatar id="A" />
        </span>
        <span className={'x-clue-card__clue'}>{task.data.cards[0].text}</span>
      </div>

      <ul className="container container--center">
        <div
          className="x-grid"
          style={{ gridTemplateColumns: `repeat(3, 1fr)`, gridTemplateRows: `repeat(3, auto)` }}
        >
          <span className="'x-grid-cell x-grid-cell--header"></span>
          <span className="'x-grid-cell x-grid-cell--header">{task.data.cards[1].text}</span>
          <span className="'x-grid-cell x-grid-cell--header">{task.data.cards[2].text}</span>
          <span className="'x-grid-cell x-grid-cell--header">{task.data.cards[3].text}</span>
          <span className="'x-grid-cell">
            <Button onClick={() => setSelection(0)} shape="circle">
              <PlusCircleFilled style={selection === 0 ? { color: 'gold' } : {}} />
            </Button>
          </span>
          <span className="'x-grid-cell">
            <Button onClick={() => setSelection(0)} shape="circle">
              <PlusCircleFilled style={selection === 0 ? { color: 'gold' } : {}} />
            </Button>
          </span>
          <span className="'x-grid-cell x-grid-cell--header">{task.data.cards[4].text}</span>
          <span className="'x-grid-cell">
            <Button onClick={() => setSelection(0)} shape="circle">
              <PlusCircleFilled style={selection === 0 ? { color: 'gold' } : {}} />
            </Button>
          </span>
          <span className="'x-grid-cell">
            <Button onClick={() => setSelection(0)} shape="circle">
              <PlusCircleFilled style={selection === 0 ? { color: 'gold' } : {}} />
            </Button>
          </span>
        </div>
      </ul>
    </>
  );
};
