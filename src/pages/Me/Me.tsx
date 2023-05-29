import { useTitle } from 'react-use';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Components
import { LoginModal } from './components/LoginModal';
import { MeContent } from './MeContent';
// Sass
import './Me.scss';
import { useEffect } from 'react';
import { useGlobalState } from 'hooks/useGlobalState';

function Me() {
  useTitle('Me - Tarde Divertida');
  const { isAuthenticated, currentUser } = useCurrentUserContext();
  const [, setLanguage] = useGlobalState('language');

  useEffect(() => {
    if (currentUser.language) {
      setLanguage(currentUser.language);
    }
  }, [currentUser.language, setLanguage]);

  return (
    <MeContent user={currentUser} additionalContent={<LoginModal isAuthenticated={isAuthenticated} />} />
  );
}

export default Me;
