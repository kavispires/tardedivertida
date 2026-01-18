import { useMeasure } from 'react-use';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import type { SlideShowConfig } from 'hooks/useSlideShow';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Icons
import { ArrowIcon } from 'icons/ArrowIcon';
import { ConeIcon } from 'icons/ConeIcon';
import { CrownIcon } from 'icons/CrownIcon';
import { XIcon } from 'icons/XIcon';
// Components
import { IconAvatar, PlayerAvatarName } from 'components/avatars';
import { DualTranslate, Translate } from 'components/language';
import { StarPoints } from 'components/points';
import {
  SlideShow,
  SlideShowBubbleValue,
  SlideShowLabel,
  SlideShowNoWins,
  SlideShowPlayersList,
} from 'components/slide-show';
import { Step } from 'components/steps';
import { StepTitle } from 'components/text';
import { gridMapUtils } from 'components/toolKits/GridMap';
// Internal
import type { City, CityLocationsDict, GalleryEntry } from './utils/types';
import { getConeColor } from './utils/helpers';
import { LocationCard } from './components/LocationCard';
import { CityMapSnippet } from './components/CityMapSnippet';

type StepGalleryProps = {
  architect: GamePlayer;
  city: City;
  cityLocationsDict: CityLocationsDict;
  placements: number;
  gallery: GalleryEntry[];
  slideShowConfig: SlideShowConfig;
  players: GamePlayers;
  coneCellIds: Dictionary<string>;
};

export function StepGallery({
  architect,
  city,
  cityLocationsDict,
  placements,
  gallery,
  slideShowConfig,
  players,
  coneCellIds,
}: StepGalleryProps) {
  useTemporarilyHidePlayersBar();
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  const constructionWidth = useCardWidth(placements + 5, { maxWidth: 256 });

  const galleryEntry = gallery[slideShowConfig.slideIndex];
  const coneColor = getConeColor(galleryEntry.coneId);

  return (
    <Step fullWidth>
      <StepTitle size="small">
        <Translate
          pt="Construções"
          en="Constructions"
        />
      </StepTitle>

      <SlideShow
        config={slideShowConfig}
        barColor={coneColor}
        leftClassName="pu-gallery__map"
        rightClassName="pu-gallery__info"
        nextButtonProps={{
          children: (
            <Translate
              pt="Ver Resultado"
              en="See Results"
            />
          ),
        }}
      >
        <div
          style={{ height: '100%' }}
          ref={ref}
        >
          <CityMapSnippet
            city={city}
            cityLocationsDict={cityLocationsDict}
            width={Math.max(width, 200)}
            height={Math.max(height, 200)}
            focusedCellId={galleryEntry.correctCellId}
          />
        </div>

        <div>
          <SlideShowLabel>
            <Translate
              pt="Projeto para o engenheiro chefe"
              en="Project for the lead engineer"
            />
            <PlayerAvatarName player={architect} />
          </SlideShowLabel>

          <Flex
            gap={12}
            align="center"
          >
            <LocationCard
              locationId={galleryEntry.locationId}
              cityLocationsDict={cityLocationsDict}
              width={constructionWidth}
              fontSize="small"
            />
            <IconAvatar
              icon={<ArrowIcon />}
              size={48}
            />
            <ConeIcon
              color={coneColor}
              width={constructionWidth / 2}
            />
          </Flex>

          {galleryEntry.correctPlayersIds.length > 0 && (
            <>
              <SlideShowLabel>
                <IconAvatar
                  icon={<CrownIcon />}
                  size="small"
                />{' '}
                <Translate
                  pt="Pedreiros Corretos"
                  en="Correct Builders"
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
                  pt="A gente sabe o que tá fazendo!"
                  en="We know what we're doing!"
                />{' '}
              </SlideShowBubbleValue>
              <SlideShowPlayersList
                players={players}
                playersIds={galleryEntry.correctPlayersIds}
              />
            </>
          )}
          {Object.keys(galleryEntry.playersSay).length > 0 && (
            <>
              <SlideShowLabel style={{ marginTop: '1em' }}>
                <IconAvatar
                  icon={<XIcon />}
                  size="small"
                />{' '}
                <Translate
                  pt="Decisão Erradas dos Pedreiros"
                  en="Builders' Wrong Decisions"
                />
              </SlideShowLabel>

              {Object.entries(galleryEntry.playersSay).map(([coneId, playersIds]) => {
                const color = getConeColor(coneId as GalleryEntry['coneId']);
                const coneCoordinate = coneCellIds?.[coneId];

                // Get orthogonally adjacent locations
                const adjacentLocationNames: DualLanguageValue[] = [];
                if (coneCoordinate) {
                  const adjacentCellIds = gridMapUtils.getAdjacentIdsToCellId(
                    city,
                    coneCoordinate,
                    'orthogonal',
                  );

                  adjacentCellIds.forEach((cellId) => {
                    const cell = gridMapUtils.getCellById(city, cellId);
                    if (cell?.data && 'locationId' in cell.data && cell.data.locationId) {
                      const locationName = cityLocationsDict[cell.data.locationId]?.name;
                      if (locationName) {
                        adjacentLocationNames.push(locationName);
                      }
                    }
                  });
                }

                return (
                  <div
                    key={coneId}
                    className="mb-2"
                  >
                    <SlideShowBubbleValue
                      color={color}
                      extra={
                        playersIds.length > 1 && (
                          <StarPoints
                            quantity={playersIds.length - 1}
                            hideText
                            keyPrefix="bonus"
                          />
                        )
                      }
                    >
                      <Translate
                        pt="Prefiro construir no cone"
                        en="I prefer building in cone site"
                      />
                      :{' '}
                      <ConeIcon
                        color={color}
                        width={16}
                      />
                      {adjacentLocationNames.map((name, index, arr) => (
                        <span
                          key={name.en}
                          className="italic"
                        >
                          <DualTranslate key={index}>{name}</DualTranslate>
                          {index < arr.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </SlideShowBubbleValue>

                    <SlideShowPlayersList
                      players={players}
                      playersIds={playersIds}
                    />
                  </div>
                );
              })}
            </>
          )}

          {galleryEntry.architectPoints === 0 && (
            <SlideShowNoWins>
              <Translate
                pt="O prefeito apelou e vai colocar essa construção num local aleatório."
                en="The mayor overruled and will place this construction in a random location."
              />
            </SlideShowNoWins>
          )}
        </div>
      </SlideShow>
    </Step>
  );
}
