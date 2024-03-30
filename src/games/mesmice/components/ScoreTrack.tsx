// Types
import type { HistoryEntry } from '../utils/types';
// Images
import featuresIcons from './feature-icons.svg';
// Icons
import { BoxQuestionMarkIcon } from 'icons/BoxQuestionMarkIcon';
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxBlankIcon } from 'icons/BoxBlankIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { RuleInstruction } from 'components/text';
import { Container } from 'components/general/Container';
import { BoxXIcon } from 'icons/BoxXIcon';

type ScoreTrackProps = {
  history: HistoryEntry[];
  hideInstructions?: boolean;
};

export function ScoreTrack({ history, hideInstructions = false }: ScoreTrackProps) {
  return (
    <Container
      titleProps={{ size: 'xx-small' }}
      title={<Translate en="Progress" pt="Progresso" />}
      contentProps={{ direction: 'vertical' }}
    >
      <div className="score-track" style={{ gridTemplateColumns: `repeat(${history.length}, 1fr)` }}>
        {history.map((entry, index) => (
          <div key={index} className="score-track__item">
            <div className="score-track__item-icon">
              {entry.featureId ? (
                <IconAvatar
                  icon={
                    <svg viewBox="0 0 512 512">
                      <use href={featuresIcons + `#${entry.featureId}`}></use>
                    </svg>
                  }
                  size="small"
                />
              ) : (
                <IconAvatar icon={<BoxQuestionMarkIcon />} size="small" />
              )}
              <div className="score-track__item-score">{entry.score}</div>
              {entry.featureId ? (
                entry.pass ? (
                  <IconAvatar icon={<BoxCheckMarkIcon />} size="small" />
                ) : (
                  <IconAvatar icon={<BoxXIcon />} size="small" />
                )
              ) : (
                <IconAvatar icon={<BoxBlankIcon />} size="small" className="invisible" />
              )}
            </div>
          </div>
        ))}
      </div>
      {!hideInstructions && (
        <RuleInstruction type="tip">
          <Translate
            en={
              <>
                From left to write, this is how many features we have to eliminate and how many points we get
                for each one. As you can see, we must eliminate some before we even get any points.
              </>
            }
            pt={
              <>
                Da esquerda para a direita, este é o número de características que temos que eliminar e
                quantos pontos ganhamos para cada uma delas. Como você pode ver, temos que eliminar algumas
                antes mesmo de ganhar pontos.
              </>
            }
          />
        </RuleInstruction>
      )}
    </Container>
  );
}
