import { Segmented } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

export function DevMenu() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const options = [
    { label: 'Home', value: '/', disabled: pathname === '/' },
    { label: 'Hub', value: '/hub', disabled: pathname === '/hub' },
    { label: 'Icons', value: '/dev/icons', disabled: pathname === '/dev/icons' },
    { label: 'Colors', value: '/dev/colors', disabled: pathname === '/dev/colors' },
    { label: 'Sprites', value: '/dev/sprites', disabled: pathname === '/dev/sprites' },
    { label: 'Resources', value: '/dev/resources', disabled: pathname === '/dev/resources' },
    { label: 'Playground', value: '/dev/playground', disabled: pathname === '/dev/playground' },
    { label: 'Showcase', value: '/showcase', disabled: pathname === '/showcase' },
  ];

  const onNavigate = (path: any) => {
    navigate(path);
  };

  return (
    <Segmented
      options={options}
      defaultValue={pathname}
      onChange={onNavigate}
      onResize={undefined}
      onResizeCapture={undefined}
    />
  );
}
