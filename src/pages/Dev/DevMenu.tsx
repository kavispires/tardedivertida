import { useLocation, useNavigate } from 'react-router-dom';
// Ant Design Resources
import { Segmented } from 'antd';

export function DevMenu() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const options = [
    { label: 'Home', value: '/', disabled: pathname === '/' },
    { label: 'Hub', value: '/hub', disabled: pathname === '/hub' },
    { label: 'Icons', value: '/dev/icons', disabled: pathname === '/dev/icons' },
    { label: 'Colors', value: '/dev/colors', disabled: pathname === '/dev/colors' },
    { label: 'Sprites', value: '/dev/sprites', disabled: pathname === '/dev/sprites' },
    { label: 'Playground', value: '/dev/playground', disabled: pathname === '/dev/playground' },
  ];

  const onNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Segmented
      options={options}
      defaultValue={pathname}
      onChange={onNavigate}
    />
  );
}
