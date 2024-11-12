import { useMeasure } from 'react-use';
// Ant Design Resources
import { DragOutlined } from '@ant-design/icons';
import { Divider, Flex, Typography } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { SlideShowConfig } from 'hooks/useSlideShow';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Icons
import { AngryMayorIcon } from 'icons/AngryMayorIcon';
import { ConeIcon } from 'icons/ConeIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
// Components
import { AvatarName, IconAvatar } from 'components/avatars';
import { DualTranslate, Translate } from 'components/language';
import { SlideShow } from 'components/slide-show';
import { Step } from 'components/steps';
import { Title } from 'components/text';
// Internal
import { City, CityLocationsDict, GalleryEntry } from './utils/types';
import { getConeColor } from './utils/helpers';
import { LocationCard } from './components/LocationCard';
import { CityMapSnippet } from './components/CityMapSnippet';

type StepGalleryProps = {
  activePlayer: GamePlayer;
  city: City;
  cityLocationsDict: CityLocationsDict;
  placements: number;
  gallery: GalleryEntry[];
  slideShowConfig: SlideShowConfig;
};

export function StepGallery({
  activePlayer,
  city,
  cityLocationsDict,
  placements,
  gallery,
  slideShowConfig,
}: StepGalleryProps) {
  useTemporarilyHidePlayersBar();
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  const constructionWidth = useCardWidth(placements + 5, { maxWidth: 256 });

  const galleryEntry = gallery[slideShowConfig.slideIndex];
  const coneColor = getConeColor(galleryEntry.cone);

  return (
    <Step fullWidth>
      <Title size="small">
        <Translate pt="Construções" en="Constructions" />
      </Title>

      <SlideShow
        config={slideShowConfig}
        barColor={coneColor}
        leftClassName="pu-gallery__map"
        rightClassName="pu-gallery__info"
        nextButtonProps={{ children: <Translate pt="Ver Resultado" en="See Results" /> }}
      >
        <div style={{ height: '100%' }} ref={ref}>
          <CityMapSnippet
            city={city}
            cityLocationsDict={cityLocationsDict}
            width={Math.max(width, 200)}
            height={Math.max(height, 200)}
            focusedCellId={galleryEntry.correctCellId}
          />
        </div>

        <div>
          <div className="pu-gallery__label">
            <Translate pt="Projeto" en="Project" />
          </div>
          <div className="pu-gallery__construction">
            <LocationCard
              locationId={galleryEntry.locationId}
              cityLocationsDict={cityLocationsDict}
              width={constructionWidth}
              fontSize="small"
            />
          </div>
          <Divider className="my-2" />

          <div className="pu-gallery__label">
            <Translate pt="Plano do Engenheiro Chefe" en="Chief Engineer's Plan" />{' '}
            <AvatarName player={activePlayer} />
          </div>

          <Cone
            cone={galleryEntry.cone}
            adjacentLocationsIds={galleryEntry.coneAdjacentLocationsIds}
            cityLocationsDict={cityLocationsDict}
          />

          <Divider className="my-2" />

          <div className="pu-gallery__label">
            <Translate pt="Decisão dos Pedreiros" en="Builders' Decision" />
          </div>

          <Cone
            cone={galleryEntry.guess}
            adjacentLocationsIds={galleryEntry.guessAdjacentLocationsIds}
            cityLocationsDict={cityLocationsDict}
          />

          <Divider className="my-2" />

          <div className="pu-gallery__label">
            <Translate pt="Resultado" en="Result" />
          </div>

          <div>
            {galleryEntry.result === 'CORRECT' ? (
              <Flex gap={8} align="center">
                <IconAvatar icon={<SealOfApprovalIcon />} size={64} />
                <Typography.Text italic>
                  <Translate
                    pt="O público aprovou esse projeto e ele será construído!"
                    en="The public approved this project and it will be built!"
                  />
                </Typography.Text>
              </Flex>
            ) : (
              <Flex gap={8} align="center">
                <IconAvatar icon={<AngryMayorIcon />} size={64} />
                <Typography.Text italic>
                  <Translate
                    pt="Prefeito: Como vocês podem ser tão burros? Isso é um desastre! Eu tive 2.41% de desaprovação! Vou colocar a construção onde ele quiser!"
                    en="Mayor: How can you be so dumb? This is a disaster! I had 2.41% disapproval! I'll put the construction wherever I want!"
                  />
                </Typography.Text>
              </Flex>
            )}
          </div>
        </div>
      </SlideShow>
    </Step>
  );
}

type ConeProps = {
  cone: GalleryEntry['cone'];
  adjacentLocationsIds: string[];
  cityLocationsDict: CityLocationsDict;
};

export function Cone({ cone, adjacentLocationsIds, cityLocationsDict }: ConeProps) {
  return (
    <Flex gap={8} align="center">
      <Flex justify="center" align="center">
        {cone}
        <IconAvatar size={48} icon={<ConeIcon color={getConeColor(cone)} width={48} />} />
      </Flex>
      <Divider type="vertical" />

      <Flex vertical>
        {adjacentLocationsIds.map((locationId) => (
          <Typography.Text>
            <DragOutlined /> <DualTranslate>{cityLocationsDict?.[locationId]?.name}</DualTranslate>
          </Typography.Text>
        ))}
      </Flex>
    </Flex>
  );
}
