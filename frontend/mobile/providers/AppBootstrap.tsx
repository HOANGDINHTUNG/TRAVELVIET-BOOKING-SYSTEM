import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { initializeApiBaseUrl } from '@/config/apiBaseUrl';
import { restorePersistedSession } from '@/services/authSession';
import { commerceDesk } from '@/theme/commerceDesk';

export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await initializeApiBaseUrl();
      await restorePersistedSession();
      if (!cancelled) {
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={commerceDesk.accent} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: commerceDesk.surfaceSoft,
  },
});
