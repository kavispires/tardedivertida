// Ant Design Resources
import { Button, Image, Space } from 'antd';
// Types
import type { SuspectCardData as SuspectCardType } from 'types/tdr';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { SuspectCard } from '@components/cards/SuspectCard';
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackTestemunhaOcular = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const cardWidth = useCardWidth(8, { gap: 8, minWidth: 150, maxWidth: 350, margin: 8 });
  const { isLoading } = useLoading();
  const { translate, language } = useLanguage();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(track.data.suspects, 'id'));
  });

  return (
    <>
      <MinigameTitle track={track} />
      <Space
        orientation="vertical"
        align="center"
        className="contained margin"
      >
        <RuleInstruction type="action">
          <Translate
            pt="Uma testemunha deu essa resposta ao tentar falar quem era o criminoso à polícia."
            en="A witness gave this answer when trying to explain who the perpetrator was to the police."
          />
        </RuleInstruction>

        <TextCard
          header={translate({ pt: 'Pergunta', en: 'Question' })}
          color="orange"
        >
          {buildAnswer(track.data.question.statement, track.data.answer, language)}
        </TextCard>

        <RuleInstruction type="action">
          <Translate
            pt="Qual dos suspeito você acha que é o criminoso?"
            en="Which one of them is the perpetrator?"
          />
        </RuleInstruction>

        <Image.PreviewGroup>
          <SpaceContainer>
            {track.data.suspects.map((suspect: SuspectCardType) => {
              return (
                <SpaceContainer
                  vertical
                  key={suspect.id}
                >
                  <SuspectCard
                    suspect={suspect}
                    width={cardWidth}
                  />

                  <Button
                    shape="round"
                    type="primary"
                    disabled={user.ready}
                    loading={isLoading}
                    onClick={() => onSelect(suspect.id)}
                  >
                    <Translate
                      pt="Selecionar"
                      en="Select"
                    />
                  </Button>
                </SpaceContainer>
              );
            })}
          </SpaceContainer>
        </Image.PreviewGroup>
      </Space>
    </>
  );
};

export const buildAnswer = (statement: string, testimony: boolean, language: string) => {
  if (language === 'pt') {
    if (testimony) {
      return statement;
    }
    if (statement.startsWith('Já')) {
      return `nunca ${statement.slice(3)}`;
    }
    return `não ${statement}`;
  }

  if (language === 'en') {
    if (testimony) {
      return statement;
    }
    if (statement.includes('ever')) {
      return `have never ${statement.slice(5)}`;
    }
    return `does not ${statement}`;
  }

  return '';
};
