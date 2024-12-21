import { HouseCard } from 'games/na-rua-do-medo/components/HouseCard';
// Ant Design Resources
import { Avatar, Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Icons
import { StreetIcon } from 'icons/StreetIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { RuleInstruction } from 'components/text';
// Internal
import type { StreetCard, TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackNaRuaDoMedo = ({ track, round, onSubmitAnswer, user }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(
      track.variant === 'kids'
        ? mockSelection(['0', '1'])
        : mockSelection(track.data.options.map((h: StreetCard) => h.id)),
    );
  });

  if (track.variant === 'kids') {
    return (
      <>
        <MinigameTitle title={{ pt: 'Na Rua do Medo', en: 'Fear Street' }} />
        <RuleInstruction type="action">
          <Translate
            pt={
              <>
                Estamos indo de porta em porta buscar doces...
                <br />
                Mas qual rua devemos ir? A rua com mais doces? A rua com menos medo?
              </>
            }
            en={
              <>
                We're trick-or-treating...
                <br />
                Which street should we hit first? The one with more candy? The one with less horror?
              </>
            }
          />
        </RuleInstruction>

        <Space className="space-container" direction="vertical">
          <TransparentButton
            className="n-street"
            disabled={user.ready || isLoading}
            onClick={() => onSelect('0')}
          >
            <Space direction="vertical" align="center" className="margin">
              <Avatar style={{ backgroundColor: 'brown' }}>A</Avatar>
              <IconAvatar icon={<StreetIcon />} size="large" />
            </Space>
            <div className="n-street__houses">
              {track.data.options['0'].map((house: StreetCard) => (
                <HouseCard key={`A-${house.id}`} card={house} candyLeftover={0} preview={false} />
              ))}
            </div>
          </TransparentButton>
          <TransparentButton
            className="n-street"
            disabled={user.ready || isLoading}
            onClick={() => onSelect('1')}
          >
            <Space direction="vertical" align="center" className="margin">
              <Avatar style={{ backgroundColor: 'dodgerblue' }}>B</Avatar>
              <IconAvatar icon={<StreetIcon />} size="large" />
            </Space>
            <div className="n-street__houses">
              {track.data.options['1'].map((house: StreetCard) => (
                <HouseCard key={`B-${house.id}`} card={house} candyLeftover={0} preview={false} />
              ))}
            </div>
          </TransparentButton>
        </Space>
      </>
    );
  }

  // TODO: This variant does not exist yet
  return (
    <>
      <MinigameTitle title={{ pt: 'Na Rua do Medo', en: 'Fear Street' }} />
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Você estava tranquilo em casa e <strong>6 crianças</strong> apareceram na sua porta. Qual das
              opções você escolheria para dar pra eles? Assustar ou guloseimas?
            </>
          }
          en={
            <>
              You are hanging out at home and <strong>6 kids</strong> showed up at our door. Which of the
              options do you choose to give to them? Scare 'em or give treats?
            </>
          }
        />
      </RuleInstruction>

      <Space className="space-container">
        {track.data.options.map((house: StreetCard) => (
          <Space direction="vertical" key={house.id} className="space-container n-street-house">
            <HouseCard card={house} candyLeftover={0} preview={false} />
            <Button
              shape="round"
              type="primary"
              disabled={user.ready || isLoading}
              onClick={() => onSelect(house.id)}
              loading={isLoading}
            >
              <Translate pt="Selecionar" en="Select" />
            </Button>
          </Space>
        ))}
      </Space>
    </>
  );
};
