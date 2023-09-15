import { ReactNode } from 'react';
// AntDesign Resources
import { Button, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { getAvatarColorById } from 'utils/helpers';
import { mockSelection } from '../../utils/mock';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';

function getRevealedEntry(options: PlainObject[], playerId: PlayerId) {
  const index = options.findIndex((option) => option.playerId === playerId);
  return index > -1 ? index : 2;
}

export const TrackFileiraDeFatos = ({ track, round, onSubmitAnswer, user, players }: TrackProps) => {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const revealedIndex = getRevealedEntry(track.data.options, user.id);

  // DEV Mock
  useMock(() => {
    onSubmitAnswer({
      data: { value: mockSelection(['before', 'after']) },
    });
  });

  return (
    <>
      <MinigameTitle title={{ pt: '', en: '' }} />

      <Space className="space-container">
        <Card header={translate('Pergunta', 'Question')}>{track.data.card.question}</Card>
      </Space>

      <Instruction contained>
        <Translate
          pt={<>Temos duas respostas numéricas em ordem crescente para a pergunta acima.</>}
          en={<>We have two secretly sorted numbered answers for the question above.</>}
        />
      </Instruction>

      <Space className="space-container">
        <Chevron
          player={players[track.data.options[0].playerId]}
          value={track.data.options[0].value}
          reveal={revealedIndex === 0}
        />
        <Chevron
          player={players[track.data.options[1].playerId]}
          value={track.data.options[1].value}
          reveal={revealedIndex === 1}
        />
      </Space>

      <Instruction contained>
        <Translate
          pt={
            <>
              A resposta abaixo vai <strong>antes</strong> ou <strong>depois</strong> das duas acima? <br />
              <em>(Para te ajudar um pouco, revelamos o valor de um dos números)</em>
            </>
          }
          en={
            <>
              Does the answer below goes <strong>before</strong> or <strong>after</strong> the two players?
              <br />
              <em>(To help out a bit, we revealed the value of one if the chevrons)</em>
            </>
          }
        />
      </Instruction>

      <Space className="space-container">
        <Chevron
          player={players[track.data.options[2].playerId]}
          value={track.data.options[2].value}
          reveal={revealedIndex === 2}
        />
      </Space>

      <Space className="space-container">
        <Button
          shape="round"
          type="primary"
          disabled={user.ready}
          loading={isLoading}
          onClick={() =>
            onSubmitAnswer({
              data: { value: 'before' },
            })
          }
        >
          <Translate pt="Antes" en="Before" />
        </Button>
        <Button
          shape="round"
          type="primary"
          disabled={user.ready}
          loading={isLoading}
          onClick={() =>
            onSubmitAnswer({
              data: { value: 'after' },
            })
          }
        >
          <Translate pt="Depois" en="After" />
        </Button>
      </Space>
    </>
  );
};

type ChevronProps = {
  player: GamePlayer;
  value: number;
  reveal?: boolean;
};

export function Chevron({ player, value, reveal }: ChevronProps) {
  const color = getAvatarColorById(player.avatarId);
  return (
    <div className="ff-chevron">
      <ChevronImage color={color}>
        <span className="ff-chevron__value">{reveal ? value : '?'}</span>
      </ChevronImage>
      <div className="ff-chevron__name">{player.name}</div>
    </div>
  );
}

type ChevronImageProps = {
  children: ReactNode;
  color: string;
};

function ChevronImage({ children, color }: ChevronImageProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        fill={color}
        d="M115.8 461.5L244 501.56a8.52 8.52 0 009.8-3.65L400.91 260.5a8.58 8.58 0 000-9L253.82 14.09a8.54 8.54 0 00-9.8-3.66L115.8 50.5a8.54 8.54 0 00-4.89 12.35l106.7 189a8.55 8.55 0 010 8.4l-106.7 189a8.54 8.54 0 004.89 12.35"
      ></path>
      <path
        fill="#000000"
        opacity="0.5"
        d="M142.94 101.4l133.68-41.56a8.53 8.53 0 015.69.22l-28.49-46a8.51 8.51 0 00-9.8-3.65L115.8 50.5a8.54 8.54 0 00-4.89 12.35L137 109a8.52 8.52 0 016-7.6"
      ></path>
      <path
        fill="#000000"
        d="M246.57 512a18.66 18.66 0 01-5.55-.85L112.8 471.08a18.58 18.58 0 01-10.64-26.87l37.25-66a10 10 0 1117.49 9.88l-36.33 64.33 125.33 39.21L391.88 256 245.9 20.37 120.57 59.54l105.79 187.32a18.71 18.71 0 010 18.28l-40.26 71.29a10 10 0 01-17.49-9.88L208.45 256 102.16 67.79a18.58 18.58 0 0110.64-26.87L241 .85a18.58 18.58 0 0121.34 8l147.1 237.36a18.49 18.49 0 010 19.58L262.36 503.2a18.58 18.58 0 01-15.79 8.8z"
      ></path>
      <foreignObject x="241.18" y="219.18" width="121.5" height="65.89">
        {children}
      </foreignObject>
    </svg>
  );
}
