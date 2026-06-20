import { StyleSheet } from 'react-native';
import { commerceDesk } from '@/theme/commerceDesk';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commerceDesk.surfaceSoft,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: commerceDesk.accent,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: commerceDesk.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: commerceDesk.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: commerceDesk.surface,
    borderRadius: commerceDesk.radius,
    borderWidth: 1,
    borderColor: commerceDesk.border,
    paddingHorizontal: 14,
    minHeight: 52,
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: commerceDesk.text,
  },
  registerButton: {
    backgroundColor: commerceDesk.accent,
    minHeight: 52,
    borderRadius: commerceDesk.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginText: {
    color: commerceDesk.textMuted,
    fontSize: 14,
  },
  loginTextBold: {
    color: commerceDesk.accent,
    fontWeight: '800',
  },
  apiHint: {
    fontSize: 11,
    color: commerceDesk.accent,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
    fontWeight: '700',
  },
});