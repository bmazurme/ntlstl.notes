import { useSelector } from 'react-redux';
import type { RootState } from '../store';

/**
 * Хук для проверки, авторизован ли пользователь
 * @returns {boolean} true, если пользователь авторизован
 */
export const useIsAuthenticated = (): { isAuthenticated: boolean; isChecking: boolean } => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const status = useSelector((state: RootState) => state.auth.status);

  return {
    isAuthenticated,
    isChecking: status === 'checking'
  };
};
