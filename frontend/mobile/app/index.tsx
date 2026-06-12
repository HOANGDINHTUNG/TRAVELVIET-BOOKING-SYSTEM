import { Redirect } from 'expo-router';
import { AppRoutes, asHref } from '@/lib/navigation';
import { getAccessToken } from '@/services/authStorage';

export default function Index() {
  if (!getAccessToken()) {
    return <Redirect href={asHref(AppRoutes.login)} />;
  }
  return <Redirect href={asHref(AppRoutes.tabs)} />;
}
