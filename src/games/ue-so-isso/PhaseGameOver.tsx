// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Col, Row } from 'antd';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import clsx from 'clsx';
import { Avatar, IconAvatar } from 'components/avatars';
import { orderBy } from 'lodash';
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxXIcon } from 'icons/BoxXIcon';
import { BoxBlankIcon } from 'icons/BoxBlankIcon';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<FlagIcon />}>
      <Title size="small" className="margin">
        <Translate pt="Dicas do jogo" en="Game's clues" />
      </Title>

      <Row gutter={[16, 16]} className="u-gallery" justify="center">
        {state.gallery.map((entry: UseSoIssoGalleryEntry, index: number) => {
          return (
            <Col xs={4} key={entry.id}>
              <div className="u-gallery-entry">
                <div className="u-gallery-entry__word">{entry.text}</div>
                {orderBy(entry.suggestions, 'invalid').map((suggestion) => (
                  <div
                    className={clsx(
                      'u-gallery-entry__suggestion',
                      suggestion.invalid && 'u-gallery-entry__suggestion--invalid'
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
