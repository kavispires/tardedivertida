// Icons
import { BoxBlankIcon } from '@icons/BoxBlankIcon';
import { BoxCheckMarkIcon } from '@icons/BoxCheckMarkIcon';
import { BoxQuestionMarkIcon } from '@icons/BoxQuestionMarkIcon';
import { BoxXIcon } from '@icons/BoxXIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { HistoryEntry } from '../utils/types';
// Images
import featuresIcons from './feature-icons.svg?url';

type ScoreTrackProps = {
  history: HistoryEntry[];
  hideInstructions?: boolean;
};

export function ScoreTrack({ history, hideInstructions = false }: ScoreTrackProps) {
  return (
    <TitledContainer
      titleProps={{ size: 'xx-small' }}
      title={
        <Translate
          en="Progress"
          pt="Progresso"
        />
      }
      contentProps={{ orientation: 'vertical' }}
    >
      <div
        className="score-track"
        style={{ gridTemplateColumns: `repeat(${history.length}, 1fr)` }}
      >
        {history.map((entry, index) => (
          <div
            key={index}
            className="score-track__item"
          >
            <div className="score-track__item-icon">
              {entry.featureId ? (
                <Icon
                  icon={
                    <svg viewBox="0 0 512 512">
                      <use href={`${featuresIcons}#${entry.featureId}`}></use>
                    </svg>
                  }
                  size="small"
                />
              ) : (
                <Icon
                  icon={<BoxQuestionMarkIcon />}
                  size="small"
                />
              )}
              <div className="score-track__item-score">{entry.score}</div>
              {entry.featureId ? (
                entry.pass ? (
                  <Icon
                    icon={<BoxCheckMarkIcon />}
                    size="small"
                  />
                ) : (
                  <Icon
                    icon={<BoxXIcon />}
                    size="small"
                  />
                )
              ) : (
                <Icon
                  icon={<BoxBlankIcon />}
                  size="small"
                  className="invisible"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {!hideInstructions && (
        <RuleInstruction type="tip">
          <Translate
            en="From left to write, this is how many features we have to eliminate and how many points we get for each one. As you can see, we must eliminate some before we even get any points."
            pt="Da esquerda para a direita, este é o número de características que temos que eliminar e quantos pontos ganhamos para cada uma delas. Como você pode ver, temos que eliminar algumas antes mesmo de ganhar pontos."
          />
        </RuleInstruction>
      )}
    </TitledContainer>
  );
}
