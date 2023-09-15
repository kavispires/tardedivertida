// AntDesign Resources
import { Space } from 'antd';
// Hooks
import { useMock } from 'hooks/useMock';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockSelection } from '../../utils/mock';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';
import { SkiingIcon } from 'icons/SkiingIcon';
import { IconAvatar } from 'components/avatars/IconAvatar';
import { TransparentButton } from 'components/buttons';
import { SnowHillIcon } from 'icons/SnowHillIcon';

export const TrackDilemaDosEsquiadores = ({ track, round, onSubmitAnswer, user }: TrackProps) => {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection([track.data.dilemma.left, track.data.dilemma.right]));
  });

  return (
    <>
      <MinigameTitle title={{ pt: '', en: '' }} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Você tem os pensamentos mais filosóficos quando você está esquiando ladeira abaixo.
              <br />
              Selecione a opção apropriada para a questão séria:
            </>
          }
          en={
            <>
              You have the most philosophical shower thoughts while skiing
              <br />
              Select the best option below:
            </>
          }
        />
      </Instruction>

      <Space className="space-container" direction="vertical">
        <div className="dd-animated-skiier">
          <IconAvatar icon={<SkiingIcon />} size={84} />
        </div>
        <Card header={translate('Dica', 'Clue')} color="red">
          {track.data.dilemma.prompt}
        </Card>

        <Space className="space-container">
          <div className="dd-buttons">
            <TransparentButton
              onClick={() => onSelect(track.data.dilemma.left)}
              disabled={user.ready || isLoading}
              className="dd-button"
            >
              <span className="dd-button__hill dd-button__hill--left">
                <IconAvatar icon={<SnowHillIcon />} size={64} />
              </span>
              <span className="dd-button__text">{track.data.dilemma.left}</span>
            </TransparentButton>
            <TransparentButton
              onClick={() => onSelect(track.data.dilemma.right)}
              disabled={user.ready || isLoading}
              className="dd-button"
            >
              <span className="dd-button__hill">
                <IconAvatar icon={<SnowHillIcon />} size={64} />
              </span>
              <span className="dd-button__text">{track.data.dilemma.right}</span>
            </TransparentButton>
          </div>
        </Space>
      </Space>
    </>
  );
};
