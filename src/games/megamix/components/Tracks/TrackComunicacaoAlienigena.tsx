// Ant Design Resources
import { Space } from 'antd';
// Types
import type { ItemData } from 'types/tdr';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Icons
import { AlienIcon } from '@icons/AlienIcon';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { ItemCard } from '@components/cards/ItemCard';
import { SignCard } from '@components/cards/SignCard';
import { Icon } from '@components/general/Icon';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { SpeechBubble } from '@components/text/SpeechBubble';
// Internal
import type { AlienSign, TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackComunicacaoAlienigena = ({ track, onSubmitAnswer }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(String(mockSelection(track.data.items.map((item: ItemData) => item.id))));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Comunicação Alienígena', en: 'Alien Communication' }} />
      <Space
        orientation="vertical"
        align="center"
        className=" margin"
      >
        <RuleInstruction type="lore">
          <Translate
            pt="Um alienígena que não fala nossa língua está pedindo um objeto com a língua dele!
            <br/>
            Mas para nossa sorte, sabemos em geral o que cada símbolo significa."
            en="An alien that doesn't speak our language is asking for an object in their language!
            <br/>
            But luckily, we know generally what each symbol means."
          />
        </RuleInstruction>

        <SpaceContainer>
          <Icon
            icon={<AlienIcon />}
            size={64}
          />{' '}
          <SpeechBubble shadow>
            <SpaceContainer>
              {track.data.attributes.map((attribute: AlienSign, index: number) => {
                return (
                  <span key={attribute.id}>
                    <SignCard signId={String(track.data.signs[index])} />
                    <DualTranslate>{attribute.name}</DualTranslate>
                  </span>
                );
              })}
            </SpaceContainer>
          </SpeechBubble>
        </SpaceContainer>

        <RuleInstruction type="action">
          <Translate
            pt="Selecione o objeto que tem a ver com o que o alienígena está pedindo."
            en="Select the object that has to do with what the alien is asking for."
          />
        </RuleInstruction>

        <SpaceContainer>
          {track.data.items.map((item: ItemData) => {
            return (
              <TransparentButton
                key={`item-${item.id}`}
                onClick={() => onSelect(item.id)}
                disabled={isLoading}
              >
                <ItemCard
                  itemId={item.id}
                  width={80}
                />
              </TransparentButton>
            );
          })}
        </SpaceContainer>
      </Space>
    </>
  );
};
