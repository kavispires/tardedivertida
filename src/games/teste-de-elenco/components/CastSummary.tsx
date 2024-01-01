// Ant Design Resources
import { Tooltip } from 'antd';
import { CheckOutlined, QuestionOutlined } from '@ant-design/icons';
// Types
import type { FeatureFilm } from '../utils/types';
// Icons
import { StarIcon } from 'icons/StarIcon';
import { FireIcon } from 'icons/FireIcon';
import { MovieStarIcon } from 'icons/MovieStarIcon';
import { SkullIcon } from 'icons/SkullIcon';
import { PlayerIcon } from 'icons/PlayerIcon';
import { LoveIcon } from 'icons/LoveIcon';
import { SupportIcon } from 'icons/SupportIcon';
import { ComedyIcon } from 'icons/ComedyIcon';
import { SpeakerIcon } from 'icons/SpeakerIcon';
import { BrainIcon } from 'icons/BrainIcon';
import { KnifeIcon } from 'icons/KnifeIcon';
// Components
import { DualTranslate } from 'components/language';
import { IconAvatar } from 'components/avatars';

type CastSummaryProps = {
  movie: FeatureFilm;
};

export function CastSummary({ movie }: CastSummaryProps) {
  const icons: Record<string, any> = {
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
