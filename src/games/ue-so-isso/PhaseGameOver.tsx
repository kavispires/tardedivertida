import clsx from 'clsx';
import { orderBy } from 'lodash';
// Ant Design Resources
import { Col, Row } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { BoxBlankIcon } from 'icons/BoxBlankIcon';
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxXIcon } from 'icons/BoxXIcon';
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { Avatar, IconAvatar } from 'components/avatars';
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { Title } from 'components/text';
// Internal
import type { GalleryEntry } from './utils/types';
import achievementsReference from './utils/achievements';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<FlagIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Title size="small" className="margin">
        <Translate pt="Dicas do jogo" en="Game's clues" />
      </Title>

      <Row gutter={[16, 16]} className="u-gallery" justify="center">
        {state.gallery.map((entry: GalleryEntry) => {
          return (
            <Col xs={4} key={entry.id}>
              <div className="u-gallery-entry">
                <div className="u-gallery-entry__word">{entry.text}</div>
                {orderBy(entry.suggestions, 'invalid').map((suggestion) => (
                  <div
                    key={suggestion.playerId}
                    className={clsx(
                      'u-gallery-entry__suggestion',
                      suggestion.invalid && 'u-gallery-entry__suggestion--invalid',
                    )}
                  >
                    <Avatar id={players[suggestion.playerId].avatarId} size="small" /> {suggestion.suggestion}
                  </div>
                ))}
                <div className="u-gallery-entry__outcome">
                  <Avatar id={players[entry.guesserId].avatarId} size="small" />

                  {entry.outcome === 'CORRECT' && <IconAvatar icon={<BoxCheckMarkIcon />} />}
                  {entry.outcome === 'WRONG' && <IconAvatar icon={<BoxXIcon />} />}
                  {entry.outcome === 'PASS' && <IconAvatar icon={<BoxBlankIcon />} />}
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </GameOverWrapper>
  );
}
