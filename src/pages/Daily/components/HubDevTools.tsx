// Ant Design Resources
import { BugFilled } from '@ant-design/icons';
import { Button, Collapse } from 'antd';
// Hooks
import { useDevFeatures } from '@hooks/useDevFeatures';
// Internal
import { dailySoundEffects, SFXAllNames } from '../utils/soundEffects';
import { DevResetLocalStorageButton } from './DevResetLocalStorageButton';

export function HubDevTools() {
  const { isDevEnv } = useDevFeatures();

  if (!isDevEnv) return null;

  return <Content />;
}

const Content = () => {
  const items = [
    {
      key: 'sounds',
      label: (
        <>
          <BugFilled /> Sound Effects Library
        </>
      ),
      children: <SFXTest />,
    },
    {
      key: 'reset',
      label: (
        <>
          <BugFilled /> Local Storage Reset
        </>
      ),
      children: <DevResetLocalStorageButton />,
    },
  ];

  return (
    <Collapse
      items={items}
      size="small"
    />
  );
};

function SFXTest() {
  return (
    <div className="hub-list">
      {SFXAllNames.map((name) => (
        <Button
          key={name}
          onClick={() => dailySoundEffects.play(name)}
          block
        >
          {name}
        </Button>
      ))}
    </div>
  );
}
