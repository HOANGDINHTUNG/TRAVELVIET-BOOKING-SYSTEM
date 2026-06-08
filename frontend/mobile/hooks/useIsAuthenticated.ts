import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getAccessToken } from '@/services/authStorage';

export function useIsAuthenticated() {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getAccessToken()));

  useFocusEffect(
    useCallback(() => {
      setAuthenticated(Boolean(getAccessToken()));
    }, [])
  );

  return authenticated;
}
