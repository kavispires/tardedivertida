import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Flex, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language';
// Internal
import type { SocialGroup, Student } from '../utils/types';
import { AGE_NUMBER, BUILD, GENDER, HEIGHT } from '../utils/constants';
import { useBoardSummary } from '../utils/hooks';
import { AgeIcon, BuildIcon, GenderIcon, HeightIcon, SocialGroupIcon } from './StudentIcon';

type BoardSummaryProps = {
  students: Dictionary<Student>;
  socialGroups: Dictionary<SocialGroup>;
};

export function BoardSummary({ students, socialGroups }: BoardSummaryProps) {
  const { language } = useLanguage();
  const summaryDicts = useBoardSummary(students);

  const summaryLists = useMemo(() => {
    return {
      ages: orderBy(
        Object.entries(summaryDicts.agesDict).map(([id, count]) => ({ id, label: AGE_NUMBER[id], count })),
        'label',
        'asc',
      ),
      builds: orderBy(
        Object.entries(summaryDicts.buildsDict).map(([id, count]) => ({ id, label: BUILD[id], count })),
        `label.${language}`,
        'asc',
      ),
      genders: orderBy(
        Object.entries(summaryDicts.gendersDict).map(([id, count]) => ({ id, label: GENDER[id], count })),
        `label.${language}`,
        'asc',
      ),
      heights: orderBy(
        Object.entries(summaryDicts.heightsDict).map(([id, count]) => ({ id, label: HEIGHT[id], count })),
        `label.${language}`,
        'asc',
      ),
      socialGroups: orderBy(
        Object.entries(summaryDicts.socialGroupsDict).map(([id, count]) => ({
          id,
          label: socialGroups[id].name,
          count,
        })),
        `label.${language}`,
        'asc',
      ),
    };
  }, [summaryDicts, language, socialGroups]);

  return (
    <div className="board-summary">
      <Typography.Title level={4}>
        <Translate en="Summary" pt="Resumo" />
      </Typography.Title>

      <div className="board-summary__data">
        <Flex vertical gap={3}>
          <div className="board-summary__label">
            <Translate en="Social Groups" pt="Grupos Sociais" />
          </div>
          {summaryLists.socialGroups.map(({ id, label, count }) => (
            <div key={label.en}>
              <SocialGroupIcon socialGroup={socialGroups[id]} /> {count}
            </div>
          ))}
        </Flex>

        <Flex vertical gap={6}>
          <div className="board-summary__label">
            <Translate en="Genders" pt="Gêneros" />
          </div>
          <Flex vertical gap={3}>
            {summaryLists.genders.map(({ id, count }) => (
              <span key={id}>
                <GenderIcon gender={id} size="small" /> {count}
              </span>
            ))}
          </Flex>

          <div className="board-summary__label">
            <Translate en="Ages" pt="Idades" />
          </div>
          <Flex vertical gap={3}>
            {summaryLists.ages.map(({ id, count }) => (
              <span key={id}>
                <AgeIcon age={id} size="small" /> {count}
              </span>
            ))}
          </Flex>
        </Flex>

        <Flex vertical gap={6}>
          <div className="board-summary__label">
            <Translate en="Builds" pt="Corpos" />
          </div>
          <Flex vertical gap={3}>
            {summaryLists.builds.map(({ id, count }) => (
              <span key={id}>
                <BuildIcon build={id} size="small" /> {count}
              </span>
            ))}
          </Flex>

          <div className="board-summary__label">
            <Translate en="Alturas" pt="Heights" />
          </div>
          <Flex vertical gap={3}>
            {summaryLists.heights.map(({ id, count }) => (
              <span key={id}>
                <HeightIcon height={id} size="small" /> {count}
              </span>
            ))}
          </Flex>
        </Flex>
      </div>
    </div>
  );
}
