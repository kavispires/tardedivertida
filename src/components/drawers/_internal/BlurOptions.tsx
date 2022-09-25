import { useState } from 'react';
import { useAsync } from 'react-use';
// Ant Design Resource
import { Alert, Button, Checkbox, message, Spin } from 'antd';
// Hooks
import { useBlurCards } from 'hooks/useBlurCards';
// Components
import { Translate } from 'components/language';

export function BlurOptions() {
  const { blurCard } = useBlurCards();

  const {
    loading,
    error,
    value: data,
  } = useAsync(async () => {
    const response = await fetch(`${process.env.REACT_APP_TDI_DATA_URL}/credo.json`);
    const result = await response.json();
    return result;
  }, []);

  const [selected, setSelected] = useState<BooleanDictionary>({
    aliens: false,
    cockroaches: false,
    scorpions: false,
    snakes: false,
    spiders: false,
  });

  const onUpdateSelected = (key: string, value: boolean) => {
    setSelected((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const onBlurSelected = () => {
    // Gather all ids of all trues
    const selectedGroups: string[][] = [];
    Object.keys(selected).forEach((key) => {
      if (selected[key] && data[key]) {
        selectedGroups.push(data[key]);
      }
    });

    selectedGroups.flat().forEach(blurCard);
    message.success(<Translate pt="Cartas 'credadas' com sucesso" en="Cards blurred successfully" />);
  };

  if (loading) {
    return (
      <div className="blur-options">
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <div className="blur-options">
        <Alert
          type="error"
          message={
            <Translate
              pt="Servidor falhou ao tentar baixar a lista de cartas credo"
              en="Server failed while trying to fetch blur cards list"
            />
          }
        />
      </div>
    );
  }

  return (
    <div className="blur-options">
      <p>
        <Translate
          pt="Você pode embaçar cartas automaticamente por tema"
          en="You may blur cards automatically by theme"
        />
        :
      </p>

      <Checkbox
        checked={selected.aliens}
        disabled={!Boolean(data.aliens)}
        onChange={(e) => onUpdateSelected('aliens', e.target.checked)}
        className="blur-options__checkbox"
      >
        <Translate pt="alienígenas" en="aliens" />
      </Checkbox>

      <Checkbox
        checked={selected.cockroaches}
        disabled={!Boolean(data.cockroaches)}
        onChange={(e) => onUpdateSelected('cockroaches', e.target.checked)}
        className="blur-options__checkbox"
      >
        <Translate pt="baratas" en="cockroaches" />
      </Checkbox>

      <Checkbox
        checked={selected.scorpions}
        disabled={!Boolean(data.scorpions)}
        onChange={(e) => onUpdateSelected('scorpions', e.target.checked)}
        className="blur-options__checkbox"
      >
        <Translate pt="escorpiões" en="scorpions" />
      </Checkbox>

      <Checkbox
        checked={selected.snakes}
        disabled={!Boolean(data.snakes)}
        onChange={(e) => onUpdateSelected('snakes', e.target.checked)}
        className="blur-options__checkbox"
      >
        <Translate pt="cobras" en="snakes" />
      </Checkbox>

      <Checkbox
        checked={selected.spiders}
        disabled={!Boolean(data.spiders)}
        onChange={(e) => onUpdateSelected('spiders', e.target.checked)}
        className="blur-options__checkbox"
      >
        <Translate pt="aranhas" en="spiders" />
      </Checkbox>

      <Button type="primary" ghost size="small" onClick={onBlurSelected}>
        <Translate pt="Credar selecionados" en="Blur all selected" />
      </Button>
    </div>
  );
}
