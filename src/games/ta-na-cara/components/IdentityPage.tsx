import { useMemo } from 'react';
// Ant Design Resources
import { Flex, Typography } from 'antd';
// Components
import { Translate } from 'components/language';
import { SlideShowLabel } from 'components/slide-show';
// Internal
import type { GalleryEntry, PhaseRevealState } from '../utils/types';
import { SuspectCard } from 'components/cards/SuspectCard';
import { AvatarName, IconAvatar } from 'components/avatars';
import type { GamePlayer, GamePlayers } from 'types/player';
import { orderBy } from 'lodash';
import { BoxXIcon } from 'icons/BoxXIcon';
import { BoxMinusIcon } from 'icons/BoxMinusIcon';
import { BoxCheckMarkIcon, BoxPlusIcon } from 'icons/collection';

type IdentityPageProps = {
  entry: GalleryEntry;
  players: GamePlayers;
  currentPlayer: GamePlayer;
  currentColor: string;
} & Pick<PhaseRevealState, 'identitiesDict' | 'questionsDict'>;

export function IdentityPage({
  entry,
  identitiesDict,
  questionsDict,
  currentPlayer,
  currentColor,
}: IdentityPageProps) {
  const orderedQuestionsIds = useMemo(() => {
    return orderBy(
      Object.keys(entry.answers),
      [(id) => entry.answers[id], (id) => questionsDict[id]?.question],
      ['desc', 'asc'],
    );
  }, [entry.answers, questionsDict]);

  return (
    <Flex className="full-width" vertical gap={24}>
      <div className="full-width" style={{ backgroundColor: currentColor }}>
        <AvatarName player={currentPlayer} size="large" />
      </div>

      <div>
        <Flex>
          <SuspectCard suspect={identitiesDict[entry.identityId]} width={128} />
        </Flex>
      </div>
      <div>
        {orderedQuestionsIds.map((questionId) => {
          const question = questionsDict[questionId];
          if (!question) return null;

          const answer = entry.answers[questionId];
          return (
            <div key={questionId} className="my-4">
              <SlideShowLabel>{question.question}</SlideShowLabel>
              {answer === -3 && (
                <Flex>
                  <IconAvatar size="small" icon={<BoxXIcon />} />
                  <IconAvatar size="small" icon={<BoxXIcon />} />
                  <Typography.Text keyboard strong>
                    <Translate pt="Não" en="No" />
                  </Typography.Text>
                </Flex>
              )}
              {answer === -1 && (
                <Flex>
                  <IconAvatar size="small" icon={<BoxMinusIcon color="#e8818c" />} />
                  <Typography.Text keyboard strong>
                    <Translate pt="Talvez Não" en="Kinda No" />
                  </Typography.Text>
                </Flex>
              )}
              {answer === 1 && (
                <Flex>
                  <IconAvatar size="small" icon={<BoxPlusIcon color="#83d39c" />} />
                  <Typography.Text keyboard strong>
                    <Translate pt="Meio Sim" en="Maybe Yes" />
                  </Typography.Text>
                </Flex>
              )}
              {answer === 3 && (
                <Flex>
                  <IconAvatar size="small" icon={<BoxCheckMarkIcon />} />
                  <IconAvatar size="small" icon={<BoxCheckMarkIcon />} />
                  <Typography.Text keyboard strong>
                    <Translate pt="Sim" en="Yes" />
                  </Typography.Text>
                </Flex>
              )}

              {/* <Flex align="center" gap={6}>
            <TextHighlight className="idp-item-name">{entry.name}</TextHighlight>
            <SpeakButton text={{ en: entry.name, pt: entry.name }} />
          </Flex> */}
            </div>
          );
        })}
      </div>
    </Flex>
  );
}
