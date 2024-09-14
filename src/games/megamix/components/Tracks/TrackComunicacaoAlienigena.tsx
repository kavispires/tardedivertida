// Ant Design Resources
import { Space } from 'antd';
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
import { Instruction } from 'components/text';
import { SpeechBubble } from 'components/text/SpeechBubble';
// Internal
import type { AlienSign, TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackComunicacaoAlienigena = ({ track, round, onSubmitAnswer, user, players }: TrackProps) => {
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
        <Instruction contained>
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
        </Instruction>

        <Space className="space-container">
          <IconAvatar icon={<AlienIcon />} size="large" />{' '}
          <SpeechBubble shadow>
            <Space className="space-container">
              {track.data.attributes.map((attribute: AlienSign, index: number) => {
                return (
                  <span>
                    <SignCard id={String(track.data.signs[index])} />
                    <DualTranslate>{attribute.name}</DualTranslate>
                  </span>
                );
              })}
            </Space>
          </SpeechBubble>
        </Space>

        <Instruction contained>
          <Translate
            pt={<>Selecione o objeto que tem a ver com a palavra que o alienígena está pedindo.</>}
            en={<>Select the object that has to do with the word the alien is asking for.</>}
          />
        </Instruction>

        <Space className="space-container">
          {track.data.items.map((itemId: number) => {
            return (
              <TransparentButton
                key={`item-${itemId}`}
                onClick={() => onSelect(String(itemId))}
                disabled={isLoading}
              >
                <ItemCard id={String(itemId)} width={80} />
              </TransparentButton>
            );
          })}
        </Space>
      </Space>
    </>
  );
};
