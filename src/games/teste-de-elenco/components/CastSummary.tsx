import type { ComponentType } from 'react';
// Ant Design Resources
import { CheckOutlined, QuestionOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
// Icons
import { BrainIcon } from 'icons/BrainIcon';
import { ComedyIcon } from 'icons/ComedyIcon';
import { FireIcon } from 'icons/FireIcon';
import { KnifeIcon } from 'icons/KnifeIcon';
import { LoveIcon } from 'icons/LoveIcon';
import { MovieStarIcon } from 'icons/MovieStarIcon';
import { PlayerIcon } from 'icons/PlayerIcon';
import { SkullIcon } from 'icons/SkullIcon';
import { SpeakerIcon } from 'icons/SpeakerIcon';
import { StarIcon } from 'icons/StarIcon';
import { SupportIcon } from 'icons/SupportIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { DualTranslate } from 'components/language';
// Internal
import type { FeatureFilm } from '../utils/types';

type CastSummaryProps = {
  movie: FeatureFilm;
};

export function CastSummary({ movie }: CastSummaryProps) {
  const icons: Record<string, ComponentType> = {
    main: StarIcon,
    anti: SkullIcon,
    supporting: SupportIcon,
    important: MovieStarIcon,
    love: LoveIcon,
    comic: ComedyIcon,
    voice: SpeakerIcon,
    minor: PlayerIcon,
    visual: FireIcon,
    dead: KnifeIcon,
    mentor: BrainIcon,
  };

  return (
    <div className="cast-summary">
      {movie.rolesOrder.map((roleId) => {
        const role = movie.roles[roleId];
        const Icon = icons?.[role.type] ?? MovieStarIcon;
        return (
          <div key={roleId} className="cast-summary__entry">
            <div className="cast-summary__type">
              <Tooltip title={<DualTranslate>{role.title}</DualTranslate>}>
                <IconAvatar icon={<Icon />} size="small" />
              </Tooltip>
            </div>
            <div className="cast-summary__cast">{role.cast ? <CheckOutlined /> : <QuestionOutlined />}</div>
          </div>
        );
      })}
    </div>
  );
}
