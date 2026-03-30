import { motion } from 'motion/react';
import { useMemo } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GameRound, GamePlayers } from 'types/game';
// Hooks
import type { SlideShowConfig } from 'hooks/useSlideShow';
// Utils
import { getAnimation } from 'utils/animations';
import { getAvatarColorById } from 'utils/helpers';
// Icons
import { BoxPlusIcon } from 'icons/BoxPlusIcon';
import { CrownIcon } from 'icons/CrownIcon';
import { XIcon } from 'icons/XIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { PlayerAvatarCard } from 'components/player';
import { StarPoints } from 'components/points';
import { SlideShow, SlideShowBubbleValue, SlideShowLabel, SlideShowPlayersList } from 'components/slide-show';
import { Step } from 'components/steps';
import { StepTitle, TextHighlight } from 'components/text';
// Internal
import type { BoardEntry, GalleryEntry } from './utils/types';
import { HappinessHighlight } from './components/Highlights';
import { HouseItem } from './components/HouseItem';

type StepGalleryProps = {
  board: BoardEntry[];
  gallery: GalleryEntry[];
  slideShowConfig: SlideShowConfig;
  players: GamePlayers;
  round: GameRound;
};

export function StepGallery({ board, gallery, slideShowConfig, players, round }: StepGalleryProps) {
  const galleryEntry = gallery[slideShowConfig.slideIndex];
  const player = players[galleryEntry.playerId];
  const playerColor = getAvatarColorById(player.avatarId);
  const itemsDict = useMemo(() => {
    return board.reduce((acc: Dictionary<BoardEntry>, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [board]);

  return (
    <Step
      fullWidth
      hidePlayersBar
    >
      <StepTitle size="small">
        <Translate
          pt="Resultado"
          en="Results"
        />
      </StepTitle>

      <SlideShow
        config={slideShowConfig}
        barColor={playerColor}
        nextButtonProps={{
          children: (
            <Translate
              pt="Ver Ranking"
              en="See Ranking"
            />
          ),
        }}
      >
        <motion.div
          className="cc-gallery-left"
          {...getAnimation('flipInY')}
          key={galleryEntry.id}
        >
          <Flex
            vertical
            align="center"
            gap={12}
          >
            <PlayerAvatarCard
              player={player}
              withName
              withRoundCorners
            />
            <TextHighlight className="cc-gallery-clue">{galleryEntry.clue}</TextHighlight>

            <SlideShowLabel>
              <Translate
                pt="Coisas que não gosto e dei a dica"
                en="Things I don't like and gave the clue about"
              />
              :
            </SlideShowLabel>

            <Flex
              gap={12}
              align="center"
              justify="center"
            >
              <HouseItem
                index={Number(itemsDict[galleryEntry.ids[0]].id)}
                setId={round.current}
                text={itemsDict[galleryEntry.ids[0]].text}
              />

              <IconAvatar
                icon={<BoxPlusIcon color={playerColor} />}
                size="small"
              />

              <HouseItem
                index={Number(itemsDict[galleryEntry.ids[1]].id)}
                setId={round.current}
                text={itemsDict[galleryEntry.ids[1]].text}
              />
            </Flex>
          </Flex>
        </motion.div>

        <motion.div
          className="cc-gallery-right"
          key={galleryEntry.id}
          {...getAnimation('fadeIn')}
        >
          <Flex vertical>
            {galleryEntry.correct.length > 0 && (
              <Flex vertical>
                <SlideShowLabel>
                  <IconAvatar
                    icon={<CrownIcon />}
                    size="small"
                  />{' '}
                  <Translate
                    pt="Palpites Corretos"
                    en="Correct Guesses"
                  />
                </SlideShowLabel>
                <SlideShowBubbleValue
                  winner
                  extra={
                    <StarPoints
                      quantity={2}
                      hideText
                      keyPrefix="correct"
                    />
                  }
                >
                  <Translate
                    pt="Entendi a dica!"
                    en="I got the clue!"
                  />{' '}
                </SlideShowBubbleValue>
                <SlideShowPlayersList
                  players={players}
                  playersIds={galleryEntry.correct}
                />
                <Flex
                  align="center"
                  gap={6}
                >
                  <Translate
                    pt="Felicidade da Casa:"
                    en="House Happiness:"
                  />{' '}
                  <HappinessHighlight>+1</HappinessHighlight>
                </Flex>
              </Flex>
            )}

            {Object.keys(galleryEntry.misses).length > 0 && (
              <Flex
                vertical
                className="mt-10"
              >
                <SlideShowLabel style={{ marginTop: '1em' }}>
                  <IconAvatar
                    icon={<XIcon />}
                    size="small"
                  />{' '}
                  <Translate
                    pt="Jogadores que erraram"
                    en="Players who missed"
                  />
                </SlideShowLabel>

                {Object.values(galleryEntry.misses).map((entry) => {
                  return (
                    <div
                      key={entry.guesserId}
                      className="mb-2"
                    >
                      <SlideShowBubbleValue>
                        {entry.guesses.map((itemId) => itemsDict[itemId].text).join(' + ')}
                      </SlideShowBubbleValue>

                      <SlideShowPlayersList
                        players={players}
                        playersIds={[entry.guesserId]}
                      />
                    </div>
                  );
                })}
              </Flex>
            )}
          </Flex>
        </motion.div>
      </SlideShow>
    </Step>
  );
}
