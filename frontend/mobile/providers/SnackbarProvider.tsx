import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { colors } from '@/theme/colors';

type SnackbarContextValue = {
  showSnackbar: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showSnackbar = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
  }, []);

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={2800}
        style={styles.snackbar}
        action={{ label: 'Đóng', onPress: () => setVisible(false) }}>
        <Text style={styles.text}>{message}</Text>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: colors.text,
    marginBottom: 8,
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
});
