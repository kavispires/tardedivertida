import { Segmented } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

export function DevMenu() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const options = [
    { label: 'Home', value: '/', disabled: pathname === '/' },
    { label: 'Hub', value: '/hub', disabled: pathname === '/hub' },
    { label: 'Avatars', value: '/dev/avatars', disabled: pathname === '/dev/avatars' },
    { label: 'Icons', value: '/dev/icons', disabled: pathname === '/dev/icons' },
    { label: 'Colors', value: '/dev/colors', disabled: pathname === '/dev/colors' },
    { label: 'Resources', value: '/dev/resources', disabled: pathname === '/dev/resources' },
    { label: 'Testing Zone', value: '/dev/testing-zone', disabled: pathname === '/dev/testing-zone' },
  ];

  const onNavigate = (path: any) => {
    navigate(path);
  };

  return <Segmented options={options} defaultValue={pathname} onChange={onNavigate} />;
}
