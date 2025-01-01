import type { FightingContender } from 'games/super-campeonato/utils/type';
// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { Card } from 'components/cards';
import { CharacterCard } from 'components/cards/CharacterCard';
import { ImageBlurButtonContainer } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackSuperCampeonato = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const cardWidth = useCardWidth(6, { minWidth: 200, maxWidth: 270 });

  // DEV Mock
  useMock(() => {
    onSubmitAnswer({
      data: { value: mockSelection(track.data.contenders, 'id') },
    });
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Super Campeonato', en: 'Ultimate Championship' }} />
      <RuleInstruction type="action">
        <Translate
          pt={<>É a batalha final, qual desses dois venceria esse desafio?</>}
          en={<>It's the final showdown, which one of these two would win this challenge?</>}
        />
      </RuleInstruction>

      <SpaceContainer>
        <Card header={translate('Desafio', 'Challenge')} color="purple">
          {track.data.challenge.text}
        </Card>
      </SpaceContainer>

      <SpaceContainer>
        {track.data.contenders.map((contender: FightingContender, index: number) => {
          return (
            <Space direction="vertical" key={contender.id}>
              <ImageBlurButtonContainer cardId={contender.id}>
                <CharacterCard
                  size={cardWidth}
                  overlayColor={index === 0 ? 'red' : 'blue'}
                  character={contender}
                />
              </ImageBlurButtonContainer>
              <Button
                shape="round"
                type="primary"
                disabled={user.ready}
                loading={isLoading}
                onClick={() =>
                  onSubmitAnswer({
                    data: { value: contender.id },
                  })
                }
              >
                <Translate pt="Selecionar" en="Select" />
              </Button>
            </Space>
          );
        })}
      </SpaceContainer>
    </>
  );
};
