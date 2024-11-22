// Ant Design Resources
import { Avatar, Space } from 'antd';
// Types
import type { TextCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { TransparentButton } from 'components/buttons';
import { EmojiCard } from 'components/cards/EmojiCard';
import { DualTranslate, Translate } from 'components/language';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

const reference = [
  {
    id: '3',
    text: {
      pt: 'Vish',
      en: 'Oh...',
    },
  },
  {
    id: '15',
    text: {
      pt: 'Quê?',
      en: 'What?',
    },
  },
  {
    id: '7',
    text: {
      pt: 'Nó!',
      en: 'Wow...',
    },
  },
];

export const TrackFileiraDeFatos = ({ track, round, onSubmitAnswer, user, players }: TrackProps) => {
  const { isLoading } = useLoading();

  const width = useCardWidth(8, {
    gap: 16,
    minWidth: 100,
    maxWidth: 200,
    margin: 32,
  });

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(track.data.scenarios, 'text'));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Fileira de Fatos', en: 'Facts Lineup' }} />
      <Space direction="vertical" align="center" className="contained margin">
        <RuleInstruction type="action">
          <Translate pt="Qual das situações é a pior?" en="Which of the following situations is the worst?" />
        </RuleInstruction>

        <Space className="space-container">
          {track.data.scenarios.map((entry: TextCard, index: number) => (
            <TransparentButton
              key={`position-${entry.text}`}
              style={{ width: `${width}px` }}
              disabled={isLoading}
              onClick={() => onSelect(entry.text)}
            >
              <div className="scenario">
                <Avatar>{LETTERS[index]}</Avatar>
                <div className="scenario__tagline">
                  <DualTranslate>{reference[index].text}</DualTranslate>
                </div>
                <EmojiCard id={reference[index].id} className="scenario__emoji" />
                {entry && <div className="scenario__card">{entry.text}</div>}
              </div>
            </TransparentButton>
          ))}
        </Space>
      </Space>
    </>
  );
};

// type ChevronProps = {
//   player: GamePlayer;
//   value: number;
//   reveal?: boolean;
// };

// export function Chevron({ player, value, reveal }: ChevronProps) {
//   const color = getAvatarColorById(player.avatarId);
//   return (
//     <div className="ff-chevron">
//       <ChevronImage color={color}>
//         <span className="ff-chevron__value">{reveal ? value : '?'}</span>
//       </ChevronImage>
//       <div className="ff-chevron__name">{player.name}</div>
//     </div>
//   );
// }

// type ChevronImageProps = {
//   children: ReactNode;
//   color: string;
// };

// function ChevronImage({ children, color }: ChevronImageProps) {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//       <path
//         fill={color}
//         d="M115.8 461.5L244 501.56a8.52 8.52 0 009.8-3.65L400.91 260.5a8.58 8.58 0 000-9L253.82 14.09a8.54 8.54 0 00-9.8-3.66L115.8 50.5a8.54 8.54 0 00-4.89 12.35l106.7 189a8.55 8.55 0 010 8.4l-106.7 189a8.54 8.54 0 004.89 12.35"
//       ></path>
//       <path
//         fill="#000000"
//         opacity="0.5"
//         d="M142.94 101.4l133.68-41.56a8.53 8.53 0 015.69.22l-28.49-46a8.51 8.51 0 00-9.8-3.65L115.8 50.5a8.54 8.54 0 00-4.89 12.35L137 109a8.52 8.52 0 016-7.6"
//       ></path>
//       <path
//         fill="#000000"
//         d="M246.57 512a18.66 18.66 0 01-5.55-.85L112.8 471.08a18.58 18.58 0 01-10.64-26.87l37.25-66a10 10 0 1117.49 9.88l-36.33 64.33 125.33 39.21L391.88 256 245.9 20.37 120.57 59.54l105.79 187.32a18.71 18.71 0 010 18.28l-40.26 71.29a10 10 0 01-17.49-9.88L208.45 256 102.16 67.79a18.58 18.58 0 0110.64-26.87L241 .85a18.58 18.58 0 0121.34 8l147.1 237.36a18.49 18.49 0 010 19.58L262.36 503.2a18.58 18.58 0 01-15.79 8.8z"
//       ></path>
//       <foreignObject x="241.18" y="219.18" width="121.5" height="65.89">
//         {children}
//       </foreignObject>
//     </svg>
//   );
// }
