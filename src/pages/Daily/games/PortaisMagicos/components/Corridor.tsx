import { motion } from 'motion/react';
import { isIOS, isSafari } from 'react-device-detect';
// Ant Design Resources
import { Avatar, Flex, Image, Tag, Typography } from 'antd';
// Utils
import { getAnimation } from 'utils/animations';
// Components
import { DoorFrame } from 'components/game/DoorFrame';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';

type CorridorProps = {
  number: number;
  imagesIds: string[];
  width: number;
  passcode?: string;
  moves: number;
};

export function Corridor({ number, imagesIds, width, passcode, moves }: CorridorProps) {
  return (
    <>
      {passcode ? (
        <Flex justify="center" gap={6}>
          <Typography.Text keyboard>{passcode}</Typography.Text>
        </Flex>
      ) : (
        <Flex justify="center" gap={6}>
          <CorridorNumber number={number} corridorNumber={1} />
          <CorridorNumber number={number} corridorNumber={2} />
          <CorridorNumber number={number} corridorNumber={3} />
        </Flex>
      )}
      <Flex justify="center" className="mt-2">
        <Tag style={{ background: 'transparent' }}>
          {moves} <Translate pt="movimentos" en="moves" />
        </Tag>
      </Flex>
      <Image.PreviewGroup>
        <SpaceContainer className="corridor">
          {imagesIds.map((cardId, index) => (
            <>
              {isIOS || isSafari ? (
                <motion.div key={cardId} {...getAnimation('zoomIn', { delay: index * 0.1, speed: 'fast' })}>
                  <ImageCard id={cardId} cardWidth={width} />
                </motion.div>
              ) : (
                <DoorFrame key={cardId} width={width}>
                  <motion.div {...getAnimation('zoomIn', { delay: index * 0.1, speed: 'fast' })}>
                    <ImageCard id={cardId} cardWidth={150} />
                  </motion.div>
                </DoorFrame>
              )}
            </>
          ))}
        </SpaceContainer>
      </Image.PreviewGroup>
    </>
  );
}

function CorridorNumber({ number, corridorNumber }: { number: number; corridorNumber: number }) {
  return (
    <Avatar
      style={corridorNumber === number ? { backgroundColor: 'gold', color: 'black' } : undefined}
      size="small"
    >
      {corridorNumber}
    </Avatar>
  );
}
