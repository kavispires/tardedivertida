import { useContext } from 'react';
import { AuthContext } from 'services/AuthProvider';

export const useCurrentUserContext = () => useContext(AuthContext);
