// Ant Design Resources
import { Slider } from 'antd';
import type { SliderSingleProps } from 'antd';
// Types
import { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import { CurrentCategory } from '../utils/types';

type NeedleChoiceProps = {
  user: GamePlayer;
  isPsychic: boolean;
  currentCategory: CurrentCategory;
};

export function NeedleChoice({ user, isPsychic, currentCategory }: NeedleChoiceProps) {
  if (isPsychic) {
    return (
      <Instruction contained>
        <Translate
          en={
            <>
              You think that {user.guess ? 'more' : 'less'} than half of the players will score points with
              your clue.
            </>
          }
          pt={
            <>
              Você acha que {user.guess ? 'mais' : 'menos'} da metade dos jogadores ganharão pontos com sua
              dica.
            </>
          }
        />
      </Instruction>
    );
  }

  const marks: SliderSingleProps['marks'] = {
    [-10]: currentCategory.left,
    0: 0,
    10: currentCategory.right,
  };

  return (
    <Instruction contained>
      <Translate en="You chose:" pt="Você escolheu" />
      <br />
      <Slider
        className="o-needle-choice"
        marks={marks}
        min={-10}
        max={10}
        tooltip={{ open: true }}
        value={user.guess}
      />
    </Instruction>
  );
}
