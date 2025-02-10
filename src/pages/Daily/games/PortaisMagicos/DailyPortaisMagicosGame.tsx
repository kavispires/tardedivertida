import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Internal
import { usePortaisMagicosDemo } from './utils/usePortaisMagicosDemo';
import { DailyPortaisMagicos } from './components/DailyPortaisMagicos';
// Sass
import './utils/styles.scss';

export function DailyPortaisMagicosGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const demo = usePortaisMagicosDemo();

  if (demo.isLoading) {
    return <DailyLoading />;
  }

  const demoData = demo?.data;

  if (demo.isError || !demoData) {
    return <DailyError />;
  }

  return <DailyPortaisMagicos key={demoData.id} data={demoData} currentUser={currentUser} />;
}
