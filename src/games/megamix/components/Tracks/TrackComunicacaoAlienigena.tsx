// Ant Design Resources
import { Space } from 'antd';
// Types
import type { Item } from 'types/tdr';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Icons
import { AlienIcon } from 'icons/AlienIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { SignCard } from 'components/cards/SignCard';
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text';
import { SpeechBubble } from 'components/text/SpeechBubble';
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
    onSelect(String(mockSelection(track.data.items)));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Comunicação Alienígena', en: 'Alien Communication' }} />
      <Space direction="vertical" align="center" className="contained margin">
        <RuleInstruction type="lore">
          <Translate
            pt={
              <>
                Um alienígena que não fala nossa língua está pedindo um objeto.
                <br />
                Qual o objeto que ele quer?
              </>
            }
            en={
              <>
                An alien who doesn't speak our language is asking for an object.
                <br />
                What object do they want?
              </>
            }
          />
        </RuleInstruction>

        <SpaceContainer>
          <IconAvatar icon={<AlienIcon />} size="large" />{' '}
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
            pt={<>Selecione o objeto que tem a ver com a palavra que o alienígena está pedindo.</>}
            en={<>Select the object that has to do with the word the alien is asking for.</>}
          />
        </RuleInstruction>

        <SpaceContainer>
          {track.data.items.map((item: Item) => {
            return (
              <TransparentButton
                key={`item-${item.id}`}
                onClick={() => onSelect(item.id)}
                disabled={isLoading}
              >
                <ItemCard id={item.id} width={80} />
              </TransparentButton>
            );
          })}
        </SpaceContainer>
      </Space>
    </>
  );
};
