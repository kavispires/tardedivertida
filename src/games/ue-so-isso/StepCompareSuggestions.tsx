import { useEffect, useState } from 'react';
// Ant Design Resources
import { Button, message, Space } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useVIP } from 'hooks/useVIP';
// Utils
import { deepCopy } from 'utils/helpers';
// Components
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { ComparisonDetailedRules, ComparisonPhaseRules } from './components/RulesBlobs';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { VIPButton, VIPOnlyContainer } from 'components/vip';
import { messageContent } from 'components/pop-up';
import { Cards } from './components/Cards';
import { ViewIf } from 'components/views';

type StepCompareSuggestionsProps = {
  isUserTheController: boolean;
  controller: GamePlayer;
  onValidateSuggestions: GenericFunction;
  onUpdateSuggestions: GenericFunction;
  players: GamePlayers;
  secretWord: UeSoIssoCard;
  suggestions: UseSoIssoSuggestion[];
} & AnnouncementProps;

export function StepCompareSuggestions({
  isUserTheController,
  controller,
  onValidateSuggestions,
  onUpdateSuggestions,
  players,
  secretWord,
  suggestions,
  announcement,
}: StepCompareSuggestionsProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [myRecommendation, setMyRecommendation] = useState<UseSoIssoSuggestion[]>(deepCopy(suggestions));
  const isVIP = useVIP();
  const [wasMessageShown, setWasMessageShown] = useState(false);

  const onSetValidation = (index: number, suggestionEntry: UseSoIssoSuggestion, notAllowed?: boolean) => {
    if (notAllowed) return;

    const newRecommendation = [...myRecommendation];
    if (newRecommendation[index]) {
      newRecommendation[index].invalid = !newRecommendation[index].invalid;
    } else {
      newRecommendation[index] = {
        ...suggestionEntry,
        invalid: true,
      };
    }

    onUpdateSuggestions({ suggestions: newRecommendation });
    setMyRecommendation(newRecommendation);
  };

  useEffect(() => {
    if (isUserTheController && !wasMessageShown && !isLoading) {
      message.info(
        messageContent(
          translate('Você controla!', 'You control!'),
          translate('Siga as instruções na página', 'Follow the instructions on the page'),
          controller.id,
          3
        )
      );
      setWasMessageShown(true);
    }
  }, [isUserTheController, controller.id, translate, wasMessageShown, isLoading]);

  const suggestionsValues = Object.values(myRecommendation);

  return (
    <Step fullWidth announcement={announcement}>
      <Title white>
        <Translate pt="Comparem as Dicas" en="Compare Clues" />
      </Title>

      <Card word={secretWord.text} />

      <PopoverRule content={<ComparisonDetailedRules />} showLabel />

      <ComparisonPhaseRules controller={controller} />

      <Cards
        suggestions={suggestions}
        readOnly={!isUserTheController}
        players={players}
        onSetValidation={onSetValidation}
        isLoading={isLoading}
        myRecommendation={myRecommendation}
      />

      <ViewIf condition={isUserTheController}>
        <Space className="u-word-compare-suggestions-step__submit">
          <Button
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() =>
              onValidateSuggestions({
                validSuggestions: suggestionsValues.filter((suggestion) => !suggestion.invalid),
              })
            }
            disabled={isLoading}
          >
            <Translate pt="Confirmar dicas válidas" en="Confirm valid clues" />
          </Button>
        </Space>
      </ViewIf>

      <VIPOnlyContainer
        label={
          <Translate
            pt="VIP Controls (use somente se o jogador controlador não controlar)"
            en="VIP Controls (only use if the assign player doesn't)"
          />
        }
        direction="vertical"
        align="center"
      >
        <Cards
          suggestions={suggestions}
          readOnly={!isVIP}
          players={players}
          onSetValidation={onSetValidation}
          isLoading={isLoading}
          myRecommendation={myRecommendation}
        />
        <VIPButton
          onClick={() =>
            onValidateSuggestions({
              validSuggestions: suggestionsValues.filter((suggestion) => !suggestion.invalid),
            })
          }
        >
          <Translate pt="Confirmar dicas válidas como Admin" en="Confirm valid clues as Admin" />
        </VIPButton>
      </VIPOnlyContainer>
    </Step>
  );
}
