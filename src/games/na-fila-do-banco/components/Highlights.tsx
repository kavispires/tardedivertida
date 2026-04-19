// Icons
import { DeckIcon } from 'icons/DeckIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { DualTranslate } from 'components/language/DualTranslate';
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';
// Internal
import { CHARACTER_TYPES } from '../utils/constants';
import { ClientSprite } from './ClientSprite';

export function ClientHighlight({
  clientId,
}: Omit<HighlightProps, 'icon' | 'children'> & { clientId: string }) {
  const client = CHARACTER_TYPES[clientId];
  return (
    <MetricHighlight
      icon={
        <IconAvatar
          icon={
            <ClientSprite
              spriteId={client.spriteId}
              width={24}
            />
          }
        />
      }
      iconPlacement="before"
    >
      <DualTranslate>{client.name}</DualTranslate>
    </MetricHighlight>
  );
}

export function DeckColorHighlight({ color }: Omit<HighlightProps, 'icon' | 'children'> & { color: string }) {
  const colorMap: Record<string, string> = {
    red: '#ff4d4f',
    green: '#52c41a',
    blue: '#1890ff',
    yellow: '#fadb14',
    purple: '#722ed1',
    brown: '#a52a2a',
    neutral: 'linear-gradient(45deg, #ff4d4f, #fadb14, #52c41a)',
  };

  return (
    <MetricHighlight
      icon={
        <div
          style={{
            width: 16,
            height: 24,
            borderRadius: '3px',
            background: colorMap[color] || colorMap.neutral,
          }}
        />
      }
      iconPlacement="before"
    >
      <span />
    </MetricHighlight>
  );
}

export function DeckCountHighlight({ children }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<DeckIcon />}
      iconPlacement="before"
    >
      {children}
    </MetricHighlight>
  );
}
