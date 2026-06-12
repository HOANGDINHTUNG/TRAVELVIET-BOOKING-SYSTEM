import { apiRequest } from '@/services/apiClient';
import type { UserAccessContext } from '@/types/auth';

export async function fetchMyAccessContext() {
  return apiRequest<UserAccessContext>('/users/me/access-context');
}
