// Ant Design Resources
import { Space, Avatar as AntAvatar } from 'antd';
// Utils
import { pluralize } from 'utils/helpers';
import { Icons } from '../utils/helpers';
// Icons
import { MovieGenreIcon } from 'icons/MovieGenreIcon';
import { NoIcon } from 'icons/NoIcon';
// Components
import { Instruction, TextHighlight, Title } from 'components/text';
import { DualTranslate, Translate } from 'components/language';
import { IconAvatar } from 'components/avatars';
import { Fragment } from 'react';

type RoleBoardProps = {
  movie?: FeatureFilm;
  activeRole: ActingRole;
  instruction: 'SELECT' | 'RESULT' | 'CAST';
  children?: React.ReactNode;
  outcome?: string;
};

export function RoleBoard({ activeRole, instruction, movie, children, outcome }: RoleBoardProps) {
  const traitCount = activeRole.traits.length;

  const movieId = movie?.id ?? '';
  const Icon = Icons?.[movieId] ?? MovieGenreIcon;

  return (
    <Space wrap>
      <Space className="role" direction="vertical" align="center">
        {movie && (
          <>
            <Icon width={75} />
            <Title size="small" className="role__title">
              <DualTranslate>{movie.title}</DualTranslate>
            </Title>
          </>
        )}
        {children}
      </Space>

      <Space className="role" direction="vertical">
        {instruction !== 'CAST' && (
          <div className="role__round">
            <AntAvatar size="large" style={{ backgroundColor: 'orange' }}>
              {instruction === 'SELECT' || outcome === 'CAST' ? activeRole.round : activeRole.round - 1}
            </AntAvatar>
          </div>
        )}
        <Title size="small" className="role__title">
          <DualTranslate>{activeRole.title}</DualTranslate>
        </Title>
        <Instruction className="role__description">
          "<DualTranslate>{activeRole.description}</DualTranslate>"
        </Instruction>

        <Instruction className="role__instructions">
          {instruction === 'SELECT' && (
            <Translate
              pt={
                <>
                  Selecione o ator que mais combina com{' '}
                  {pluralize(traitCount, 'a característica', 'as características')} abaixo:
                </>
              }
              en={<>Select the actor that best fits the {pluralize(traitCount, 'trait')} below:</>}
            />
          )}

          {instruction === 'RESULT' && (
            <Translate
              pt="Esses são as características para esse papel:"
              en="These are the traits for this role:"
            />
          )}

          {instruction === 'CAST' && !activeRole.cast && (
            <div className="role__cancelled">
              <IconAvatar icon={<NoIcon />} />{' '}
              <Translate
                pt="Papel cancelado por falta de atores competentes"
                en="Role canceled due to lack of competent actors"
              />
            </div>
          )}
        </Instruction>

        <Instruction className="role__traits">
          <ul>
            {activeRole.traits.map((trait, index) => {
              if (index === traitCount - 1 && instruction === 'RESULT' && outcome === 'CONTINUE') {
                return <Fragment key={trait} />;
              }
              return (
                <li key={trait}>
                  <TextHighlight>{trait}</TextHighlight>
                </li>
              );
            })}
          </ul>
        </Instruction>
      </Space>
    </Space>
  );
}
