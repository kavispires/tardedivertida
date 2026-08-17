// Ant Design Resources
import { Slider, type SliderSingleProps } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { CurrentCategory } from '../utils/types';

type NeedleChoiceProps = {
  user: GamePlayer;
  isPsychic: boolean;
  currentCategory: CurrentCategory;
};

export function NeedleChoice({ user, isPsychic, currentCategory }: NeedleChoiceProps) {
  if (isPsychic) {
    return (
      <Surface
        contained
        className="my-4"
      >
        <Translate
          en="You think that {guess} than half of the players will score points with your clue."
          pt="Você acha que {guess} da metade dos jogadores ganharão pontos com sua dica."
          values={{
            guess: user.guess ? 'more' : 'less',
          }}
        />
      </Surface>
    );
  }

  const marks: SliderSingleProps['marks'] = {
    [-10]: currentCategory.left,
    0: 0,
    10: currentCategory.right,
  };

  return (
    <Surface
      contained
      className="my-4"
    >
      <Translate
        en="You chose:"
        pt="Você escolheu"
      />
      <br />
      <div className="mx-10">
        <Slider
          className="o-needle-choice"
          marks={marks}
          min={-10}
          max={10}
          tooltip={{ open: true }}
          value={user.guess}
        />
      </div>
    </Surface>
  );
}
