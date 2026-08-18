import { useState } from 'react';
// Ant Design Resources
import { Button, Input } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockText } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackEspiaoEntreNos = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [answer, setAnswer] = useState('');

  const onSubmit = () => {
    if (answer.length > 1) {
      onSubmitAnswer({
        data: { value: answer },
      });
    }
  };

  // DEV Mock
  useMock(() => {
    onSubmitAnswer({
      data: { value: mockText() },
    });
  });

  return (
    <>
      <MinigameTitle title={{ pt: '', en: '' }} />
      <RuleInstruction type="action">
        <Translate
          pt="Você está em um(a) {location}. Você é um(a) {role}.<br/>Agora, responda à pergunta abaixo com uma resposta simples."
          en="You are at/in/on a {location}. You are a {role}.<br/>Now, simply answer the following question."
          values={{
            location: <TextHighlight>{track.data.location.name}</TextHighlight>,
            role: <TextHighlight>{track.data.location.roles[track.data.roleIndex]}</TextHighlight>,
          }}
        />
      </RuleInstruction>

      <SpaceContainer>
        <TextCard
          header={
            <Translate
              pt="Carta"
              en="Card"
            />
          }
        >
          {track.data.question}
        </TextCard>
      </SpaceContainer>

      <RuleInstruction type="action">
        <Translate
          pt="Responda à pergunta abaixo com uma resposta simples."
          en="Answer the prompt below with a simple answer."
        />
      </RuleInstruction>

      <SpaceContainer vertical>
        <Input
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={translate({ pt: 'Escreva aqui', en: 'Answer here' })}
          onPressEnter={onSubmit}
          disabled={isLoading || user.ready}
        />
        <Button
          shape="round"
          type="primary"
          disabled={user.ready || answer.length < 2}
          loading={isLoading}
          onClick={onSubmit}
        >
          <Translate
            pt="Selecionar"
            en="Select"
          />
        </Button>
      </SpaceContainer>
    </>
  );
};
